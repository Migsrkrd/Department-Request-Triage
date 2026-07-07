import type { RequestStatus, UserRole } from '../types'

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  needs_info: 'Needs Info',
  approved: 'Approved',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

export const STATUS_ORDER: RequestStatus[] = [
  'new',
  'in_review',
  'needs_info',
  'approved',
  'in_progress',
  'resolved',
]

// Manager can move requests along the workflow
export const MANAGER_STATUS_OPTIONS: Record<RequestStatus, RequestStatus[]> = {
  new: ['in_review'],
  in_review: ['needs_info', 'approved'],
  needs_info: ['in_review'],
  approved: ['in_progress'],
  in_progress: ['resolved'],
  resolved: [],
}

export function getNextAction(
  status: RequestStatus,
  role: UserRole,
  managerNote?: string,
): string {
  if (role === 'employee') {
    switch (status) {
      case 'new':
        return 'Your request is queued. Operations will review it shortly.'
      case 'in_review':
        return 'Operations is reviewing your request. No action needed from you.'
      case 'needs_info':
        return managerNote
          ? `Action needed: ${managerNote}`
          : 'Operations needs more information. Check the notes below.'
      case 'approved':
        return "Approved — work will begin soon. You'll be notified when it starts."
      case 'in_progress':
        return managerNote
          ? `In progress: ${managerNote}`
          : 'Your request is being worked on.'
      case 'resolved':
        return 'This request has been resolved. No further action needed.'
    }
  }

  // Manager next actions
  switch (status) {
    case 'new':
      return 'Review this request and move it to In Review.'
    case 'in_review':
      return 'Assign priority, then approve or request more info.'
    case 'needs_info':
      return 'Waiting on employee response. Follow up if needed.'
    case 'approved':
      return 'Move to In Progress when work begins.'
    case 'in_progress':
      return 'Mark as Resolved when complete.'
    case 'resolved':
      return 'No action required.'
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function daysAgo(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
