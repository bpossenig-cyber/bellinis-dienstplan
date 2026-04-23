import { useState, type FormEvent } from 'react'

import { hasSupabaseConfig } from '@/lib/supabaseClient'

interface Props {
  onLogin: (email: string, password: string) => Promise<void>
  error?: string | null
}

export const LoginPage = ({ onLogin, error }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    try {
      await onLogin(email, password)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-layout">
      <section className="card auth-card">
        <h1>Bellinis Dienstplan</h1>
        {!hasSupabaseConfig && (
          <p className="warning">
            Supabase ist noch nicht konfiguriert. Lege `VITE_SUPABASE_URL` und
            `VITE_SUPABASE_ANON_KEY` an.
          </p>
        )}
        <form onSubmit={submit} className="stack">
          <input
            type="email"
            required
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button disabled={busy}>{busy ? 'Anmeldung...' : 'Anmelden'}</button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>
    </main>
  )
}
