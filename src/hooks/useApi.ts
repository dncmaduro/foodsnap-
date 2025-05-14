import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions 
} from "@tanstack/react-query";
import { callApi, ApiResponse } from "@/lib/api";

// Hook for GET requests
export function useApiQuery<T>(
  queryKey: string[],
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => callApi<T>({ 
      path, 
      method: 'GET', 
      params 
    }),
    ...options
  });
}

// Hook for POST requests
export function useApiMutation<T, V>(
  path: string,
  options?: UseMutationOptions<ApiResponse<T>, Error, V>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (variables: V) => callApi<T>({
      path,
      method: 'POST',
      body: variables
    }),
    ...options
  });
}

// Hook for PUT requests
export function useApiPutMutation<T, V>(
  path: string,
  options?: UseMutationOptions<ApiResponse<T>, Error, V>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (variables: V) => callApi<T>({
      path,
      method: 'PUT',
      body: variables
    }),
    ...options
  });
}

// Hook for DELETE requests
export function useApiDeleteMutation<T>(
  path: string,
  options?: UseMutationOptions<ApiResponse<T>, Error, void>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => callApi<T>({
      path,
      method: 'DELETE'
    }),
    ...options
  });
}