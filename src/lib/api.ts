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

// BỎ kiểu ApiResponse<T>!
// export interface ApiResponse<T> {
//   data: T | null
//   error: string | null
//   status: number
// }

/**
 * callApi sẽ:
 * - trả về responseData nếu thành công (response.ok)
 * - throw Error nếu thất bại (response.ok === false)
 */
export async function callApi<T>({
  path,
  method,
  body,
  params,
  headers = {},
}: ApiOptions): Promise<T> {
  const apiPath = path.startsWith('/') ? path : `/${path}`
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  const url = new URL(`${baseUrl}${apiPath}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const authHeaders = getAuthHeaders()
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const options: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders,
      ...headers,
    },
    credentials: 'include',
  }

  if (body && method !== 'GET') {
    options.body = isFormData ? body : JSON.stringify(body)
  }

  // Nếu debug thì mở 2 dòng dưới
  // console.log(`Making ${method} request to ${url.toString()}`)

  const response = await fetch(url.toString(), options)
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const responseData = isJson ? await response.json() : null

  // console.log('Response:', response.status, responseData)

  if (response.ok) {
    return responseData
  }

  // Nếu lỗi, show toast và throw để react-query bắt vào onError
  const errorMessage = responseData?.message || response.statusText || 'Lỗi không xác định'
  toast({
    title: 'Lỗi API',
    description: errorMessage,
    variant: 'destructive',
  })
  throw new Error(errorMessage)
}
