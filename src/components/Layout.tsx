import type { ReactNode } from 'react'
import { useApp } from '../store/AppContext'
import type { View } from '../types'

interface LayoutProps {
  children: ReactNode
}

const navItems: {
  view: View
  label: string
  roles: ('employee' | 'manager')[]
}[] = [
  { view: 'dashboard', label: 'Dashboard', roles: ['employee', 'manager'] },
  { view: 'requests', label: 'Requests', roles: ['employee', 'manager'] },
  { view: 'new-request', label: 'New Request', roles: ['employee'] },
]

export function Layout({ children }: LayoutProps) {
  const { currentUser, logout, setView, view } = useApp()

  if (!currentUser) return <>{children}</>

  const roleLabel =
    currentUser.role === 'manager' ? 'Operations Manager' : 'Employee'

  const visibleNav = navItems.filter((item) =>
    item.roles.includes(currentUser.role),
  )

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true">
            ◈
          </span>
          <div>
            <span className="header__title">Request Triage</span>
            <span className="header__subtitle">Internal Operations</span>
          </div>
        </div>

        <nav className="header__nav" aria-label="Main navigation">
          {visibleNav.map((item) => (
            <button
              key={item.view}
              className={`nav-link ${view === item.view || (view === 'request-detail' && item.view === 'requests') ? 'nav-link--active' : ''}`}
              onClick={() => setView(item.view)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header__user">
          <div className="header__user-info">
            <span className="header__user-name">{currentUser.name}</span>
            <span className="header__user-role">{roleLabel}</span>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={logout}>
            Switch user
          </button>
        </div>
      </header>

      <main className="main">{children}</main>
    </div>
  )
}
