import { Layout } from './components/Layout'
import { AppProvider, useApp } from './store/AppContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { RequestListPage } from './pages/RequestListPage'
import { RequestDetailPage } from './pages/RequestDetailPage'
import { NewRequestPage } from './pages/NewRequestPage'

function AppContent() {
  const { view } = useApp()

  if (view === 'login') {
    return <LoginPage />
  }

  return (
    <Layout>
      {view === 'dashboard' && <DashboardPage />}
      {view === 'requests' && <RequestListPage />}
      {view === 'request-detail' && <RequestDetailPage />}
      {view === 'new-request' && <NewRequestPage />}
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
