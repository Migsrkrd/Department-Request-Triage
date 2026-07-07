import { USERS } from '../data/users'
import { useApp } from '../store/AppContext'

export function LoginPage() {
  const { login } = useApp()

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__logo" aria-hidden="true">◈</span>
          <h1>Request Triage</h1>
          <p className="login-card__tagline">
            Internal operations portal for department requests
          </p>
        </div>

        <p className="login-card__hint">
          Select a demo user to explore the app. No password required.
        </p>

        <div className="login-options">
          {USERS.map((user) => (
            <button
              key={user.id}
              className="login-option"
              onClick={() => login(user.id)}
            >
              <div className="login-option__avatar">
                {user.name.charAt(0)}
              </div>
              <div className="login-option__info">
                <span className="login-option__name">{user.name}</span>
                <span className="login-option__role">
                  {user.role === 'manager'
                    ? 'Operations Manager'
                    : `Employee · ${user.department}`}
                </span>
              </div>
              <span className="login-option__arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>

        <p className="login-card__footer">
          This is a demo environment. Data is stored locally in your browser.
        </p>
      </div>
    </div>
  )
}
