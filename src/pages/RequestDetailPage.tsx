import { useState } from 'react'
import { PriorityBadge, StatusBadge } from '../components/Badges'
import { useApp } from '../store/AppContext'
import type { Priority, RequestStatus } from '../types'
import {
  formatDateTime,
  getNextAction,
  MANAGER_STATUS_OPTIONS,
  STATUS_LABELS,
} from '../utils/helpers'
import { getUserById } from '../data/users'

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent']

export function RequestDetailPage() {
  const {
    currentUser,
    requests,
    selectedRequestId,
    setView,
    updateRequestStatus,
    updateRequestPriority,
  } = useApp()

  const [note, setNote] = useState('')
  const [showNoteField, setShowNoteField] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<RequestStatus | null>(null)

  const request = requests.find((r) => r.id === selectedRequestId)

  if (!request || !currentUser) {
    return (
      <div className="page">
        <button className="back-link" onClick={() => setView('requests')}>
          ← Back to requests
        </button>
        <p>Request not found.</p>
      </div>
    )
  }

  const isManager = currentUser.role === 'manager'
  const submitter = getUserById(request.submittedBy)
  const nextAction = getNextAction(
    request.status,
    currentUser.role,
    request.managerNote,
  )
  const allowedTransitions = isManager
    ? MANAGER_STATUS_OPTIONS[request.status]
    : []

  const handleStatusChange = (status: RequestStatus) => {
    if (status === 'needs_info') {
      setPendingStatus(status)
      setShowNoteField(true)
      return
    }
    updateRequestStatus(request.id, status, note || undefined)
    setNote('')
    setShowNoteField(false)
    setPendingStatus(null)
  }

  const confirmStatusWithNote = () => {
    if (!pendingStatus) return
    updateRequestStatus(request.id, pendingStatus, note)
    setNote('')
    setShowNoteField(false)
    setPendingStatus(null)
  }

  return (
    <div className="page">
      <button className="back-link" onClick={() => setView('requests')}>
        ← Back to requests
      </button>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-header">
            <h1>{request.title}</h1>
            <div className="detail-header__badges">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
            </div>
          </div>

          <div className="next-action-banner">
            <span className="next-action-banner__label">Next step</span>
            <p>{nextAction}</p>
          </div>

          <section className="card detail-section">
            <h2>Description</h2>
            <p className="detail-description">{request.description}</p>
          </section>

          <section className="card detail-section">
            <h2>Details</h2>
            <dl className="detail-meta">
              <div>
                <dt>Department</dt>
                <dd>{request.department}</dd>
              </div>
              <div>
                <dt>Submitted by</dt>
                <dd>{submitter?.name ?? request.submittedBy}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{formatDateTime(request.submittedAt)}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatDateTime(request.updatedAt)}</dd>
              </div>
            </dl>
          </section>

          {request.managerNote && (
            <section className="card detail-section">
              <h2>{isManager ? 'Your note' : 'Note from Operations'}</h2>
              <p className="detail-note">{request.managerNote}</p>
            </section>
          )}
        </div>

        {isManager && (
          <aside className="detail-sidebar">
            <div className="card manager-panel">
              <h2>Manager controls</h2>
              <p className="manager-panel__hint">
                Update priority and move this request through the workflow.
              </p>

              <div className="manager-control">
                <label htmlFor="priority-select">Priority</label>
                <select
                  id="priority-select"
                  value={request.priority ?? ''}
                  onChange={(e) =>
                    updateRequestPriority(
                      request.id,
                      e.target.value as Priority,
                    )
                  }
                >
                  <option value="" disabled>
                    Set priority
                  </option>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {allowedTransitions.length > 0 && (
                <div className="manager-control">
                  <span className="manager-control__label">Move to</span>
                  <div className="status-actions">
                    {allowedTransitions.map((status) => (
                      <button
                        key={status}
                        className="btn btn--outline btn--sm"
                        onClick={() => handleStatusChange(status)}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showNoteField && (
                <div className="manager-control">
                  <label htmlFor="manager-note">
                    Note for employee
                    <span className="form-hint">
                      {' '}
                      Required when requesting info
                    </span>
                  </label>
                  <textarea
                    id="manager-note"
                    rows={3}
                    placeholder="What information do you need?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="form-actions form-actions--compact">
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => {
                        setShowNoteField(false)
                        setPendingStatus(null)
                        setNote('')
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn--primary btn--sm"
                      disabled={!note.trim()}
                      onClick={confirmStatusWithNote}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {request.status === 'resolved' && (
                <p className="manager-panel__done">This request is complete.</p>
              )}
            </div>

            <div className="card workflow-guide">
              <h3>Workflow</h3>
              <ol className="workflow-steps">
                {(
                  [
                    'new',
                    'in_review',
                    'approved',
                    'in_progress',
                    'resolved',
                  ] as RequestStatus[]
                ).map((step) => (
                  <li
                    key={step}
                    className={
                      request.status === step
                        ? 'workflow-steps__current'
                        : request.status === 'needs_info' &&
                            step === 'in_review'
                          ? 'workflow-steps__current'
                          : ''
                    }
                  >
                    {STATUS_LABELS[step]}
                  </li>
                ))}
              </ol>
              <p className="workflow-guide__note">
                "Needs Info" branches off from In Review and returns when the
                employee responds.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
