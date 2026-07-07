export type UserRole = 'employee' | 'manager'

export type RequestStatus =
  'new' | 'in_review' | 'needs_info' | 'approved' | 'in_progress' | 'resolved'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type Department = 'IT' | 'Facilities' | 'HR' | 'Finance'

export interface User {
  id: string
  name: string
  role: UserRole
  department: string
}

export interface Request {
  id: string
  title: string
  description: string
  department: Department
  status: RequestStatus
  priority: Priority | null
  submittedBy: string
  submittedAt: string
  updatedAt: string
  managerNote?: string
}

export type View =
  'login' | 'dashboard' | 'requests' | 'request-detail' | 'new-request'

export interface Filters {
  status: RequestStatus | 'all'
  priority: Priority | 'all' | 'unset'
  department: Department | 'all'
}
