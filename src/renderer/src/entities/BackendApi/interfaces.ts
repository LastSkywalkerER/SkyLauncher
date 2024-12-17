import { interfaces } from 'inversify'

import { IMCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.interface'

export interface LoginData {
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

export interface MinecraftProfileResponse {
  username: string
  uuid: string
  minecraft_access_token: string
  minecraft_access_expires_in: string
}

export interface IBackendApi {
  login: (data: LoginData) => Promise<LoginResponse>
  register: (data: RegisterData) => Promise<LoginResponse>
  logout: () => Promise<unknown>
  refresh: () => Promise<unknown>
  getProfile: () => Promise<ProfileResponse>
  getMinecraftProfile: () => Promise<MinecraftProfileResponse>
  getCustomMCVersions: () => Promise<IMCGameVersion[]>
}

export interface ErrorResponse {
  response?: {
    data?: {
      error?: string
      message?: string
    }
  }
}

export namespace IBackendApi {
  export const $: interfaces.ServiceIdentifier<IBackendApi> = Symbol('IBackendApi')
}
