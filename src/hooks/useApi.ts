import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { callApi, ApiResponse } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

// Hook for GET requests
export function useApiQuery<T>(
  queryKey: string[],
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>>, 'queryKey' | 'queryFn'>,
) {
  const token = useAuthStore.getState().accessToken

  return useQuery({
    queryKey,
    queryFn: async () =>
      callApi<T>({
        path,
        method: 'GET',
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ...options,
  })
}

// Hook for POST requests
export function useApiMutation<T, V>(
  path: string,
  options?: UseMutationOptions<ApiResponse<T>, Error, V>,
) {
  const queryClient = useQueryClient()

  const token = useAuthStore.getState().accessToken

  return useMutation({
    mutationFn: async (variables: V) =>
      callApi<T>({
        path,
        method: 'POST',
        body: variables,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ...options,
  })
}

// Hook for PUT requests
export function useApiPutMutation<T, V>(
  path: string,
  options?: UseMutationOptions<ApiResponse<T>, Error, V>,
) {
  const queryClient = useQueryClient()

  const token = useAuthStore.getState().accessToken

  return useMutation({
    mutationFn: async (variables: V) =>
      callApi<T>({
        path,
        method: 'PUT',
        body: variables,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ...options,
  })
}

// Hook for DELETE requests
export function useApiDeleteMutation<T>(
  path: string,
  options?: UseMutationOptions<ApiResponse<T>, Error, void>,
) {
  const queryClient = useQueryClient()

  const token = useAuthStore.getState().accessToken

  return useMutation({
    mutationFn: async () =>
      callApi<T>({
        path,
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ...options,
  })
}

// Hook for PATCH requests
export function useApiPatchMutation<T, V>(
  path: string,
  options?: UseMutationOptions<ApiResponse<T>, Error, V>,
) {
  const queryClient = useQueryClient()

  const token = useAuthStore.getState().accessToken

  return useMutation({
    mutationFn: async (variables: V) =>
      callApi<T>({
        path,
        method: 'PATCH',
        body: variables,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ...options,
  })
}
