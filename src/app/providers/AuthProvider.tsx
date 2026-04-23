import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { Session } from '@supabase/supabase-js'

import { getCurrentProfile } from '@/lib/api/bellinisApi'
import { hasSupabaseConfig, supabase } from '@/lib/supabaseClient'
import type { UserProfile } from '@/lib/types'

interface AuthContextType {
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  reloadProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadProfile = useCallback(async () => {
    if (!hasSupabaseConfig || !supabase) {
      setProfile(null)
      setLoading(false)
      return
    }

    const profileData = await getCurrentProfile()
    setProfile(profileData)
  }, [])

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setLoading(false)
      return
    }

    let active = true

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await reloadProfile()
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      void reloadProfile()
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [reloadProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      setError('Supabase ist nicht konfiguriert.')
      return
    }
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      throw signInError
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      profile,
      loading,
      error,
      signIn,
      signOut,
      reloadProfile,
    }),
    [session, profile, loading, error, signIn, signOut, reloadProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden.')
  }
  return context
}
