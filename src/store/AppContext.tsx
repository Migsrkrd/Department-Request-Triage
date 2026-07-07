import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { SEED_REQUESTS } from '../data/seedRequests'
import { USERS } from '../data/users'
import type {
  Department,
  Filters,
  Priority,
  Request,
  RequestStatus,
  User,
  View,
} from '../types'

const STORAGE_KEY = 'request-triage-data'

interface AppState {
  currentUser: User | null
  requests: Request[]
  view: View
  selectedRequestId: string | null
  filters: Filters
  submitSuccess: boolean
}

interface AppContextValue extends AppState {
  login: (userId: string) => void
  logout: () => void
  setView: (view: View) => void
  selectRequest: (id: string | null) => void
  setFilters: (filters: Partial<Filters>) => void
  createRequest: (data: {
    title: string
    description: string
    department: Department
  }) => void
  updateRequestStatus: (
    id: string,
    status: RequestStatus,
    note?: string,
  ) => void
  updateRequestPriority: (id: string, priority: Priority) => void
  clearSubmitSuccess: () => void
  getVisibleRequests: () => Request[]
}

const defaultFilters: Filters = {
  status: 'all',
  priority: 'all',
  department: 'all',
}

function loadRequests(): Request[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Request[]
  } catch {
    // fall through to seed data
  }
  return SEED_REQUESTS
}

function saveRequests(requests: Request[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<Request[]>(loadRequests)
  const [view, setView] = useState<View>('login')
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  )
  const [filters, setFiltersState] = useState<Filters>(defaultFilters)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    saveRequests(requests)
  }, [requests])

  const login = (userId: string) => {
    const user = USERS.find((u) => u.id === userId)
    if (!user) return
    setCurrentUser(user)
    setView('dashboard')
    setFiltersState(defaultFilters)
  }

  const logout = () => {
    setCurrentUser(null)
    setView('login')
    setSelectedRequestId(null)
    setSubmitSuccess(false)
  }

  const selectRequest = (id: string | null) => {
    setSelectedRequestId(id)
    setView(id ? 'request-detail' : 'requests')
  }

  const setFilters = (partial: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }))
  }

  const createRequest = (data: {
    title: string
    description: string
    department: Department
  }) => {
    if (!currentUser) return
    const now = new Date().toISOString()
    const newRequest: Request = {
      id: `req-${Date.now()}`,
      title: data.title,
      description: data.description,
      department: data.department,
      status: 'new',
      priority: null,
      submittedBy: currentUser.id,
      submittedAt: now,
      updatedAt: now,
    }
    setRequests((prev) => [newRequest, ...prev])
    setSubmitSuccess(true)
    setView('dashboard')
  }

  const updateRequestStatus = (
    id: string,
    status: RequestStatus,
    note?: string,
  ) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedAt: new Date().toISOString(),
              ...(note !== undefined ? { managerNote: note } : {}),
            }
          : r,
      ),
    )
  }

  const updateRequestPriority = (id: string, priority: Priority) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, priority, updatedAt: new Date().toISOString() }
          : r,
      ),
    )
  }

  const clearSubmitSuccess = () => setSubmitSuccess(false)

  const getVisibleRequests = (): Request[] => {
    let list = requests
    if (currentUser?.role === 'employee') {
      list = list.filter((r) => r.submittedBy === currentUser.id)
    }
    return list
      .filter((r) => filters.status === 'all' || r.status === filters.status)
      .filter((r) => {
        if (filters.priority === 'all') return true
        if (filters.priority === 'unset') return r.priority === null
        return r.priority === filters.priority
      })
      .filter(
        (r) =>
          filters.department === 'all' || r.department === filters.department,
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        requests,
        view,
        selectedRequestId,
        filters,
        submitSuccess,
        login,
        logout,
        setView,
        selectRequest,
        setFilters,
        createRequest,
        updateRequestStatus,
        updateRequestPriority,
        clearSubmitSuccess,
        getVisibleRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
