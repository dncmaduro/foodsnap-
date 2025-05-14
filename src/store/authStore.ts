import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveToCookies, getFromCookies } from '@/lib/cookies'
import { callApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

// Define types for our store
export interface User {
  id?: string
  fullname: string
  email: string
  phonenumber: string
}

interface AuthState {
  user: User | null
  accessToken: string
  isLoading: boolean
  error: string | null

  // Computed properties
  isAuthenticated: () => boolean

  // Actions
  setAuth: (payload: SetAuthPayload) => void
  clearAuth: () => void
  login: (phonenumber: string, password: string) => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

interface SetAuthPayload {
  user: User
  accessToken: string
  refreshToken: string
}

interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

interface ApiSuccessResponse {
  statusCode: number
  message: string
  data: LoginResponse
}

// Create the store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: '',
      isLoading: false,
      error: null,

      // Computed properties
      isAuthenticated: () => !!get().accessToken,

      setAuth: (payload: SetAuthPayload) => {
        set({
          user: payload.user,
          accessToken: payload.accessToken,
          error: null,
        })
        saveToCookies('refreshToken', payload.refreshToken)
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: '',
          error: null,
        })
        saveToCookies('refreshToken', '')
      },

      login: async (phonenumber: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await callApi<ApiSuccessResponse>({
            path: '/auth/login',
            method: 'POST',
            body: { phonenumber, password },
          })

          if (response.error || !response.data) {
            set({
              isLoading: false,
              error: response.error || 'Login failed',
            })

            toast({
              title: 'Đăng nhập thất bại',
              description: response.error || 'Vui lòng kiểm tra thông tin đăng nhập',
              variant: 'destructive',
            })

            return false
          }

          const { user, access_token, refresh_token } = response.data.data

          get().setAuth({
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          })

          set({ isLoading: false })

          toast({
            title: 'Đăng nhập thành công',
            description: `Chào mừng ${user.fullname || 'bạn'} quay trở lại!`,
          })

          return true
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed'
          set({
            isLoading: false,
            error: errorMessage,
          })

          toast({
            title: 'Đăng nhập thất bại',
            description: errorMessage,
            variant: 'destructive',
          })

          return false
        }
      },

      logout: () => {
        get().clearAuth()

        toast({
          title: 'Đã đăng xuất',
          description: 'Bạn đã đăng xuất thành công',
        })
      },

      refreshToken: async () => {
        const refreshToken = getFromCookies('refreshToken')

        if (!refreshToken) {
          get().clearAuth()
          return false
        }

        try {
          const response = await callApi<ApiSuccessResponse>({
            path: '/auth/refresh',
            method: 'POST',
            body: { refresh_token: refreshToken },
          })

          if (response.error || !response.data) {
            get().clearAuth()
            set({ error: response.error || 'Token refresh failed' })
            return false
          }

          const { user, access_token, refresh_token } = response.data.data

          get().setAuth({
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          })

          return true
        } catch (error) {
          get().clearAuth()
          set({ error: 'Token refresh failed' })
          return false
        }
      },
    }),
    {
      name: 'auth-store',
    },
  ),
)

// Initialize token refresh on module import
// This ensures token refresh happens as soon as possible
setTimeout(() => {
  useAuthStore.getState().refreshToken()
}, 0)
