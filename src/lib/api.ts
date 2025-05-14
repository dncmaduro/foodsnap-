import { toast } from '@/hooks/use-toast'
import { getAuthHeaders } from './authUtils'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiOptions {
  path: string
  method: HttpMethod
  body?: any
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export async function callApi<T>({
  path,
  method,
  body,
  params,
  headers = {},
}: ApiOptions): Promise<ApiResponse<T>> {
  try {
    // Đảm bảo path bắt đầu với dấu /
    const apiPath = path.startsWith('/') ? path : `/${path}`

    // Use environment variable for backend URL
    const baseUrl = import.meta.env.VITE_BACKEND_URL

    // Construct URL with query parameters
    const url = new URL(`${baseUrl}${apiPath}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    // Add authentication headers if available
    const authHeaders = getAuthHeaders()

    // Prepare request options
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers,
      },
      credentials: 'include', // Include cookies for authentication
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body)
    }

    console.log(`Making ${method} request to ${url.toString()}`)

    // Make the request
    const response = await fetch(url.toString(), options)
    const isJson = response.headers.get('content-type')?.includes('application/json')
    const responseData = isJson ? await response.json() : null

    console.log('Response:', response.status, responseData)

    // Handle successful responses
    if (response.ok) {
      return {
        data: responseData,
        error: null,
        status: response.status,
      }
    }

    // Handle error responses
    const errorMessage = responseData?.message || response.statusText || 'Unknown error'
    return {
      data: null,
      error: errorMessage,
      status: response.status,
    }
  } catch (error) {
    // Handle network errors
    console.error('API call error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Network error'
    toast({
      title: 'API Error',
      description: errorMessage,
      variant: 'destructive',
    })

    return {
      data: null,
      error: errorMessage,
      status: 0,
    }
  }
}
