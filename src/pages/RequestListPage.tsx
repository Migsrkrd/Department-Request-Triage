import { EmptyState } from '../components/EmptyState'
import { PriorityBadge, StatusBadge } from '../components/Badges'
import { useApp } from '../store/AppContext'
import type { Department, Priority, RequestStatus } from '../types'
import { formatDate, STATUS_LABELS } from '../utils/helpers'

const DEPARTMENTS: Department[] = ['IT', 'Facilities', 'HR', 'Finance']
const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent']
const STATUSES: RequestStatus[] = [
  'new',
  'in_review',
  'needs_info',
  'approved',
  'in_progress',
  'resolved',
]

export function RequestListPage() {
  const { currentUser, getVisibleRequests, selectRequest, filters, setFilters, setView } =
    useApp()

  const requests = getVisibleRequests()
  const isManager = currentUser?.role === 'manager'

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{isManager ? 'All Requests' : 'My Requests'}</h1>
          <p className="page-header__subtitle">
            {isManager
              ? 'Filter and triage requests across departments.'
              : 'View and track everything you\'ve submitted.'}
          </p>
        </div>
        {!isManager && (
          <button className="btn btn--primary" onClick={() => setView('new-request')}>
            + New request
          </button>
        )}
      </div>

      {isManager && (
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ status: e.target.value as RequestStatus | 'all' })
              }
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-priority">Priority</label>
            <select
              id="filter-priority"
              value={filters.priority}
              onChange={(e) =>
                setFilters({
                  priority: e.target.value as Priority | 'all' | 'unset',
                })
              }
            >
              <option value="all">All priorities</option>
              <option value="unset">Unassigned</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-dept">Department</label>
            <select
              id="filter-dept"
              value={filters.department}
              onChange={(e) =>
                setFilters({ department: e.target.value as Department | 'all' })
              }
            >
              <option value="all">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {(filters.status !== 'all' ||
            filters.priority !== 'all' ||
            filters.department !== 'all') && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() =>
                setFilters({ status: 'all', priority: 'all', department: 'all' })
              }
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <section className="card">
        {requests.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={isManager ? 'No matching requests' : 'No requests found'}
            description={
              isManager
                ? 'Try adjusting your filters or check back later.'
                : 'You haven\'t submitted any requests yet.'
            }
            action={
              !isManager ? (
                <button className="btn btn--primary" onClick={() => setView('new-request')}>
                  Create a request
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="request-table">
            {requests.map((req) => (
              <button
                key={req.id}
                className="request-row"
                onClick={() => selectRequest(req.id)}
              >
                <div className="request-row__main">
                  <span className="request-row__title">{req.title}</span>
                  <span className="request-row__meta">
                    {req.department}
                    {isManager && ` · ${req.submittedBy === 'michael' ? 'Michael' : req.submittedBy}`}
                    {' · '}
                    {formatDate(req.submittedAt)}
                  </span>
                </div>
                <div className="request-row__badges">
                  <StatusBadge status={req.status} />
                  <PriorityBadge priority={req.priority} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
