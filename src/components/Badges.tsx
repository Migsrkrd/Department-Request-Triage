import type { Priority, RequestStatus } from '../types'
import { STATUS_LABELS } from '../utils/helpers'

const statusStyles: Record<RequestStatus, string> = {
  new: 'badge--new',
  in_review: 'badge--review',
  needs_info: 'badge--info',
  approved: 'badge--approved',
  in_progress: 'badge--progress',
  resolved: 'badge--resolved',
}

interface StatusBadgeProps {
  status: RequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${statusStyles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

const priorityStyles: Record<Priority, string> = {
  low: 'badge--priority-low',
  medium: 'badge--priority-medium',
  high: 'badge--priority-high',
  urgent: 'badge--priority-urgent',
}

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

interface PriorityBadgeProps {
  priority: Priority | null
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (!priority) {
    return <span className="badge badge--unset">Unassigned</span>
  }
  return (
    <span className={`badge ${priorityStyles[priority]}`}>
      {priorityLabels[priority]}
    </span>
  )
}
