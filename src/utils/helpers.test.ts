import { describe, it, expect } from 'vitest'
import { formatDate, getNextAction } from './helpers'

describe('formatDate', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2026-01-15T10:00:00.000Z')).toMatch(/Jan/)
  })
})

describe('getNextAction', () => {
  it('returns employee copy for new requests', () => {
    expect(getNextAction('new', 'employee')).toContain('queued')
  })
})
