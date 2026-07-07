import { useEffect } from 'react'
import { EmptyState } from '../components/EmptyState'
import { PriorityBadge, StatusBadge } from '../components/Badges'
import { SummaryCard } from '../components/SummaryCard'
import { useApp } from '../store/AppContext'
import { formatDate, getNextAction } from '../utils/helpers'

export function DashboardPage() {
  const {
    currentUser,
    getVisibleRequests,
    selectRequest,
    setView,
    submitSuccess,
    clearSubmitSuccess,
  } = useApp()

  const requests = getVisibleRequests()
  const isManager = currentUser?.role === 'manager'

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(clearSubmitSuccess, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitSuccess, clearSubmitSuccess])

  if (!currentUser) return null

  if (isManager) {
    const open = requests.filter((r) => r.status !== 'resolved')
    const needsReview = requests.filter((r) => r.status === 'new' || r.status === 'in_review')
    const urgent = requests.filter((r) => r.priority === 'urgent' || r.priority === 'high')
    const resolvedThisWeek = requests.filter((r) => {
      if (r.status !== 'resolved') return false
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      return new Date(r.updatedAt).getTime() > weekAgo
    })

    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Operations Dashboard</h1>
            <p className="page-header__subtitle">
              Review incoming requests, set priorities, and keep work moving.
            </p>
          </div>
        </div>

        <div className="summary-grid">
          <SummaryCard label="Open requests" value={open.length} hint="Across all departments" />
          <SummaryCard
            label="Needs review"
            value={needsReview.length}
            hint="New + in review"
            accent="warning"
          />
          <SummaryCard
            label="High priority"
            value={urgent.length}
            hint="High & urgent"
            accent="info"
          />
          <SummaryCard
            label="Resolved this week"
            value={resolvedThisWeek.length}
            accent="success"
          />
        </div>

        <section className="card">
          <div className="card__header">
            <h2>Needs attention</h2>
            <button className="btn btn--ghost btn--sm" onClick={() => setView('requests')}>
              View all
            </button>
          </div>

          {needsReview.length === 0 ? (
            <EmptyState
              icon="✓"
              title="All caught up"
              description="No requests are waiting for review right now."
            />
          ) : (
            <div className="request-table">
              {needsReview.slice(0, 5).map((req) => (
                <button
                  key={req.id}
                  className="request-row"
                  onClick={() => selectRequest(req.id)}
                >
                  <div className="request-row__main">
                    <span className="request-row__title">{req.title}</span>
                    <span className="request-row__meta">
                      {req.department} · {formatDate(req.submittedAt)}
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

  // Employee dashboard
  const active = requests.filter((r) => r.status !== 'resolved')
  const needsAction = requests.filter((r) => r.status === 'needs_info')
  const recent = requests.slice(0, 4)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Hi, {currentUser.name}</h1>
          <p className="page-header__subtitle">
            Track your department requests and see what happens next.
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => setView('new-request')}>
          + New request
        </button>
      </div>

      {submitSuccess && (
        <div className="toast toast--success" role="status">
          <span>✓</span>
          <div>
            <strong>Request submitted</strong>
            <p>Operations will review it shortly. You can track progress below.</p>
          </div>
        </div>
      )}

      <div className="summary-grid summary-grid--employee">
        <SummaryCard label="Active requests" value={active.length} />
        <SummaryCard
          label="Needs your input"
          value={needsAction.length}
          accent={needsAction.length > 0 ? 'warning' : 'default'}
        />
        <SummaryCard
          label="Resolved"
          value={requests.filter((r) => r.status === 'resolved').length}
          accent="success"
        />
      </div>

      {needsAction.length > 0 && (
        <section className="card card--highlight">
          <h2>Action needed</h2>
          {needsAction.map((req) => (
            <button
              key={req.id}
              className="action-item"
              onClick={() => selectRequest(req.id)}
            >
              <div>
                <span className="action-item__title">{req.title}</span>
                <p className="action-item__text">
                  {getNextAction(req.status, 'employee', req.managerNote)}
                </p>
              </div>
              <StatusBadge status={req.status} />
            </button>
          ))}
        </section>
      )}

      <section className="card">
        <div className="card__header">
          <h2>Your requests</h2>
          {requests.length > 0 && (
            <button className="btn btn--ghost btn--sm" onClick={() => setView('requests')}>
              View all
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No requests yet"
            description="Submit your first department request and track it here."
            action={
              <button className="btn btn--primary" onClick={() => setView('new-request')}>
                Create a request
              </button>
            }
          />
        ) : (
          <div className="request-table">
            {recent.map((req) => (
              <button
                key={req.id}
                className="request-row"
                onClick={() => selectRequest(req.id)}
              >
                <div className="request-row__main">
                  <span className="request-row__title">{req.title}</span>
                  <span className="request-row__next">
                    {getNextAction(req.status, 'employee', req.managerNote)}
                  </span>
                </div>
                <div className="request-row__badges">
                  <StatusBadge status={req.status} />
                  {req.priority && <PriorityBadge priority={req.priority} />}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
