"use client"

import { createClient } from "@/utils/supabase/client"
import { Session, User } from "@supabase/supabase-js"
import { AuthService } from "@/app/services/AuthService"
import { createContext, useContext, useEffect, useState } from "react"

const supabase = createClient();
const authService = new AuthService(supabase);

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshAuth: async () => {},
})

export function AuthProvider({ children, initialUser = null, initialSession = null }: { children: React.ReactNode, initialUser?: User | null, initialSession?: Session | null }) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isLoading, setIsLoading] = useState(!initialUser && !initialSession)

  const refreshAuth = async () => {
    try {
      const { data: { user }, error } = await authService.getUser()
      if (error) {
        setSession(null)
        setUser(null)
      } else {
        setUser(user)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialUser || initialSession) {
      setIsLoading(false)
    } else {
      refreshAuth()
    }
  }, [initialUser, initialSession])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshAuth()
      }
    }

    const handleFocus = () => {
      refreshAuth()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 