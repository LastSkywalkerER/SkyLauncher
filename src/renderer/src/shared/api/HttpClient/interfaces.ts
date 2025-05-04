import { interfaces } from 'inversify'

export interface RequestData {
  url: string
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
}

export interface ResponseData<T> {
  statusCode: number
  body: T
  headers?: Record<string, string>
}

export interface AuthData {
  token: string
  type: string
}

export interface IHttpClient {
  request: <T>(data: RequestData) => Promise<ResponseData<T>>
  setAuth(data: AuthData): void
  removeAuth(): void
  getAuth(): AuthData | null
}

export namespace IHttpClient {
  export const $: interfaces.ServiceIdentifier<IHttpClient> = Symbol('IHttpClient')
  export const baseUrl: interfaces.ServiceIdentifier<IHttpClient> = Symbol('IHttpClient.baseUrl')
}
