export interface RequestData {
  url: string
  options?: {
    method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'
    headers?: Record<string, string>
    body?: string | Buffer | Uint8Array | null
  }
}

export interface ResponseData {
  statusCode: number
  body: unknown
  headers?: Record<string, string | string[] | undefined>
  trailers?: Record<string, string>
  opaque?: unknown
  context?: object
}
