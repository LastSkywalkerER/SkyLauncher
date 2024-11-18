import { interfaces } from 'inversify'

export interface LoginData {
  userName: string
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export interface RegisterData extends LoginData {
  confirmPassword: string
  terms: unknown
}

export interface ProfileResponse {
  email: {
    value: string
    isConfirmed: boolean
  }
  role: {
    name: string
  }
}

export interface IBackendApi {
  login: (data: LoginData) => Promise<LoginResponse>
  register: (data: RegisterData) => Promise<LoginResponse>
  logout: () => Promise<unknown>
  refresh: () => Promise<unknown>
  getProfile: () => Promise<ProfileResponse>
  getMinecraftProfile: () => Promise<unknown>
}

export namespace IBackendApi {
  export const $: interfaces.ServiceIdentifier<IBackendApi> = Symbol('IBackendApi')
}
