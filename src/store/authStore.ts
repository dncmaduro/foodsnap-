import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveToCookies, getFromCookies } from '@/lib/cookies'
import { callApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

// Định nghĩa type như cũ

export const useAuthStore = create<any>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: '',
      isLoading: false,
      error: null,

      isAuthenticated: () => !!get().accessToken,

      setAuth: (payload: any) => {
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
          const response = await callApi<any>({
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

          const { user, access_token, refresh_token } = response.data

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
          const response = await callApi<any>({
            path: '/auth/refresh',
            method: 'POST',
            body: { refresh_token: refreshToken },
          })

          if (response.error || !response.data) {
            get().clearAuth()
            set({ error: response.error || 'Token refresh failed' })
            return false
          }

          const { user, access_token, refresh_token } = response.data

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
