import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse } from '@/types/auth'
import { setAuthToken } from '@/api/auth'
import api from '@/api/auth'

interface AuthContextType {
  user: AuthResponse | null
  login: (authData: AuthResponse) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        // Check if token is expired
        const payload = JSON.parse(atob(token.split('.')[1]))
        const isExpired = payload.exp * 1000 < Date.now()
        
        if (isExpired) {
          logout()
        } else {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setAuthToken(token)
        }
      } catch (error) {
        logout()
      }
    }
  }, [logout])

  // Intercept 401 responses and auto-logout
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(interceptor)
    }
  }, [logout])

  const login = (authData: AuthResponse) => {
    setUser(authData)
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData))
    setAuthToken(authData.token)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
