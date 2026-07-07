import { useState } from 'react'
import { useApp } from '../store/AppContext'
import type { Department } from '../types'

const DEPARTMENTS: { value: Department; label: string; hint: string }[] = [
  { value: 'IT', label: 'IT', hint: 'Hardware, software, access' },
  { value: 'Facilities', label: 'Facilities', hint: 'Building, HVAC, supplies' },
  { value: 'HR', label: 'HR', hint: 'People, policies, org changes' },
  { value: 'Finance', label: 'Finance', hint: 'Expenses, budgets, invoices' },
]

export function NewRequestPage() {
  const { createRequest, setView } = useApp()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState<Department | ''>('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please add a title for your request.')
      return
    }
    if (!description.trim()) {
      setError('Please describe what you need.')
      return
    }
    if (!department) {
      setError('Please select a department.')
      return
    }
    createRequest({ title: title.trim(), description: description.trim(), department })
  }

  return (
    <div className="page page--narrow">
      <button className="back-link" onClick={() => setView('dashboard')}>
        ← Back to dashboard
      </button>

      <div className="page-header">
        <div>
          <h1>New Request</h1>
          <p className="page-header__subtitle">
            Tell us what you need. Operations will review and route it to the right team.
          </p>
        </div>
      </div>

      <form className="card form" onSubmit={handleSubmit}>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">What do you need?</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Laptop replacement, room booking issue..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <div className="dept-grid">
            {DEPARTMENTS.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`dept-option ${department === d.value ? 'dept-option--selected' : ''}`}
                onClick={() => {
                  setDepartment(d.value)
                  setError('')
                }}
              >
                <span className="dept-option__label">{d.label}</span>
                <span className="dept-option__hint">{d.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Details</label>
          <textarea
            id="description"
            rows={5}
            placeholder="Include relevant context — what's happening, when it started, and any urgency."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setError('')
            }}
          />
          <span className="form-hint">
            The more detail you provide, the faster we can help.
          </span>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={() => setView('dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Submit request
          </button>
        </div>
      </form>
    </div>
  )
}
