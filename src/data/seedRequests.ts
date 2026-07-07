import type { Request } from '../types'

// Realistic sample data so the demo feels lived-in on first load
export const SEED_REQUESTS: Request[] = [
  {
    id: 'req-001',
    title: 'Laptop screen flickering during video calls',
    description:
      'My MacBook Pro screen flickers intermittently during Zoom and Teams calls. Happens 2–3 times per meeting. External monitor works fine.',
    department: 'IT',
    status: 'in_progress',
    priority: 'high',
    submittedBy: 'michael',
    submittedAt: '2026-07-01T09:15:00Z',
    updatedAt: '2026-07-03T14:22:00Z',
    managerNote: 'Replacement display ordered — ETA Thursday.',
  },
  {
    id: 'req-002',
    title: 'Conference Room B AC not cooling',
    description:
      'Room B has been uncomfortably warm during afternoon meetings. Thermostat shows 78°F but feels hotter.',
    department: 'Facilities',
    status: 'in_review',
    priority: 'medium',
    submittedBy: 'michael',
    submittedAt: '2026-07-04T11:30:00Z',
    updatedAt: '2026-07-05T08:45:00Z',
  },
  {
    id: 'req-003',
    title: 'Update org chart for Q3 reorg',
    description:
      'Need the internal org chart updated to reflect the marketing team split into Brand and Growth.',
    department: 'HR',
    status: 'needs_info',
    priority: 'low',
    submittedBy: 'michael',
    submittedAt: '2026-06-28T16:00:00Z',
    updatedAt: '2026-07-02T10:10:00Z',
    managerNote:
      'Please confirm the full list of team members for each new group.',
  },
  {
    id: 'req-004',
    title: 'Expense report stuck in approval queue',
    description:
      'Submitted expense report #4821 on June 20. Still showing "pending manager approval" but my manager already approved.',
    department: 'Finance',
    status: 'resolved',
    priority: 'medium',
    submittedBy: 'michael',
    submittedAt: '2026-06-20T13:45:00Z',
    updatedAt: '2026-06-25T09:30:00Z',
    managerNote:
      'Rerouted through correct approval chain. Reimbursement processed.',
  },
  {
    id: 'req-005',
    title: 'VPN access for contractor — design team',
    description:
      'New contractor starting July 14 needs VPN access to Figma and shared drives for 3-month engagement.',
    department: 'IT',
    status: 'approved',
    priority: 'high',
    submittedBy: 'michael',
    submittedAt: '2026-07-06T08:00:00Z',
    updatedAt: '2026-07-06T15:20:00Z',
    managerNote: 'Approved. IT will provision access by July 10.',
  },
  {
    id: 'req-006',
    title: 'Broken hand dryer — 3rd floor restroom',
    description:
      'Hand dryer in the north restroom has not worked for over a week.',
    department: 'Facilities',
    status: 'new',
    priority: null,
    submittedBy: 'michael',
    submittedAt: '2026-07-07T07:50:00Z',
    updatedAt: '2026-07-07T07:50:00Z',
  },
]
