# Department Request Triage

A small internal ops app where employees submit department requests and operations managers review, prioritize, and resolve them. Built as a practical engineering evaluation — focused on product judgment over code volume.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). Pick a demo user on the login screen — no password needed.

**Demo users:**
- **Michael** (Employee) — submit and track your own requests
- **Sarah** (Operations Manager) — triage all requests, set priority, advance workflow

## What makes this app different

Most triage demos are just CRUD with a table. I tried to make the *roles feel different*:

- **Employees** see a guided dashboard with "next step" language, action-needed callouts, and a simple submission flow with department picker hints
- **Managers** get a triage dashboard with summary cards, filters, and a sidebar to move requests through the workflow
- **Status-aware copy** — the same request reads differently depending on who's looking. Michael sees "Operations is reviewing your request" while Sarah sees "Assign priority, then approve or request more info"
- **Realistic seed data** — six pre-loaded requests across IT, Facilities, HR, and Finance so the demo doesn't start empty

The workflow is intentionally linear with one branch: New → In Review → (Needs Info | Approved) → In Progress → Resolved. "Needs Info" loops back to In Review once the employee responds.

Data persists in `localStorage`, so changes survive page refreshes during a demo.

## AI tools used

**Cursor (Claude)** was used to scaffold and build the app. Here's how it influenced the solution:

- **Structure first** — I described the role-aware product requirements upfront, and the AI helped organize types, context store, and page components without over-engineering (no router, no backend, no auth library)
- **Product copy** — the "next action" helper and role-specific microcopy came from iterating on what each persona actually needs to see, not just hiding buttons
- **CSS polish** — the AI generated the design token system and component styles; I kept it to a single CSS file to avoid dependency bloat
- **Scope control** — I explicitly asked to keep it demoable in under 3 minutes, which prevented feature creep (no comments system, no notifications, no drag-and-drop kanban)

The AI sped up boilerplate significantly. The product decisions — workflow shape, what each role sees, seed data realism — were directed by the requirements and refined during implementation.

## If this were production software

Three things I'd tackle first:

1. **Real auth and permissions** — SSO integration, role-based access enforced server-side, and audit logging for status changes. Right now anyone can switch users; that's fine for a demo but not for real ops data.

2. **Notifications** — email or Slack when a request changes status, especially for "Needs Info" and "Resolved." Employees shouldn't have to check a portal to know something needs their attention.

3. **Backend with proper data model** — move off localStorage to a real API with request history, attachments, assignment to specific ops staff, and SLA tracking. The current workflow is a straight line; production would need configurable workflows per department.

## Tech stack

- React 19 + Vite + TypeScript
- React Context for state (with localStorage persistence)
- Plain CSS (no UI framework)
- No routing library — simple view state in context

## Project structure

```
src/
  components/     Badges, Layout, SummaryCard, EmptyState
  data/           Seed requests and demo users
  pages/          Login, Dashboard, RequestList, RequestDetail, NewRequest
  store/          AppContext (state + actions)
  utils/          Status labels, next-action copy, date formatting
```
