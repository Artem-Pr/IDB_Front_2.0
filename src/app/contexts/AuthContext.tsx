import React, {
  createContext, useContext, useState, useCallback, useEffect, useMemo,
} from 'react'

import { authService } from 'src/api/api-client'
import type { LoginCredentials } from 'src/api/types/request-types'
import type { AuthResponse } from 'src/api/types/response-types'

interface AuthContextType {
  user: AuthResponse['user'] | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'))
  const [isInitialized, setIsInitialized] = useState(false)

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      setAccessToken(response.accessToken)
      setRefreshToken(response.refreshToken)
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }, [refreshToken])

  const refreshAccessToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (!storedRefreshToken) return

    try {
      const response = await authService.refreshToken(storedRefreshToken)
      setAccessToken(response.accessToken)
      setRefreshToken(response.refreshToken)
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
    }
  }, [logout])

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (storedAccessToken && storedRefreshToken) {
        // Only refresh if the token is about to expire (e.g., in the next 5 minutes)
        const tokenData = JSON.parse(atob(storedAccessToken.split('.')[1]))
        const expiresAt = tokenData.exp * 1000 // Convert to milliseconds
        const fiveMinutes = 1 * 60 * 1000
        if (expiresAt - Date.now() < fiveMinutes) {
          await refreshAccessToken()
        }
      }
      setIsInitialized(true)
      authService.setInitialized() // Mark initialization as complete
    }

    initializeAuth()
  }, [refreshAccessToken])

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken && isInitialized,
    login,
    logout,
  }), [user, accessToken, refreshToken, isInitialized, login, logout])

  useEffect(() => {
    if (isInitialized) {
      console.log('Auth state:', { isAuthenticated: !!accessToken && isInitialized })
    }
  }, [isInitialized, accessToken])

  if (!isInitialized) {
    return null // or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
