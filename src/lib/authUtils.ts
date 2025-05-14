import { useAuthStore } from '@/store/authStore'

/**
 * Get authentication headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const { accessToken } = useAuthStore.getState()

  if (!accessToken) {
    return {}
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated()
}

/**
 * Get the current user
 */
export function getCurrentUser() {
  return useAuthStore.getState().user
}
