import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { useAuth } from '@/app/providers/AuthProvider'

function App() {
  const { profile, session, loading, error, signIn, signOut } = useAuth()

  if (loading) {
    return <main className="auth-layout">Lade Session...</main>
  }

  if (!session || !profile) {
    return <LoginPage onLogin={signIn} error={error} />
  }

  return <DashboardPage profile={profile} onSignOut={signOut} />
}

export default App
