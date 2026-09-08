const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export class ApiError extends Error {
  status: number
  body: any

  constructor(message: string, status: number, body: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('authToken')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as any)['Authorization'] = `Bearer ${token}`
  }

  // Normalize endpoint: ensure it has leading and trailing slash to avoid Django APPEND_SLASH redirects
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = normalizedEndpoint.endsWith('/') ? `${API_BASE_URL}${normalizedEndpoint}` : `${API_BASE_URL}${normalizedEndpoint}/`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const text = await response.text()

  // Try to parse JSON body when present
  let body: any = undefined
  try {
    body = text ? JSON.parse(text) : undefined
  } catch (err) {
    body = text
  }

  if (!response.ok) {
    // Handle 401 Unauthorized - clear auth and redirect
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // Redirect to login
      window.location.href = '/login'
    }

    // Build a friendly message when validation errors exist
    let message = `API Error: ${response.status} ${response.statusText}`

    if (body) {
      if (typeof body === 'string') {
        message = body
      } else if (body.detail) {
        message = String(body.detail)
      } else if (typeof body === 'object') {
        // Concatenate field errors into a short string
        const parts: string[] = []
        for (const [key, val] of Object.entries(body)) {
          if (Array.isArray(val)) {
            parts.push(`${key}: ${val.join(', ')}`)
          } else if (typeof val === 'string') {
            parts.push(`${key}: ${val}`)
          } else {
            parts.push(`${key}: ${JSON.stringify(val)}`)
          }
        }
        if (parts.length) message = parts.join(' | ')
      }
    }

    throw new ApiError(message, response.status, body)
  }

  return body as T
}

export default apiCall
