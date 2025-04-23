import { AxiosError } from 'axios'
import { interfaces } from 'inversify'

import { IMCGameVersion } from '../../../../../shared/entities/mc-game-version/mc-game-version.interface'

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

export interface MinecraftProfileResponse {
  username: string
  uuid: string
  minecraft_access_token: string
  minecraft_access_expires_in: string
}

export interface ProfileResponse {
  createdAt: string
  email: {
    value: string
    isConfirmed: boolean
  }
  minecraftProfile?: {
    createdAt: string
    username: MinecraftProfileResponse['username']
    uuid: MinecraftProfileResponse['uuid']
  }
  role: string
}

export interface ModpackVersion {
  id: string
  name: string
  title: string
  modpack_name: string
  modpack_version: string
  minecraft_version: string
  modloader: string
  modloader_version: string
  icon: string
  cover_image: string
  title_image: string
  description: string
  download_url: string
}

export interface Modpack {
  id: string
  name: string
  versions: ModpackVersion[]
}

export interface MCModpack {
  id: string
  name: string
  versions: IMCGameVersion[]
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

export interface ErrorResponse
  extends AxiosError<{
    error?: string
    message?: string
  }> {}

export namespace IBackendApi {
  export const $: interfaces.ServiceIdentifier<IBackendApi> = Symbol('IBackendApi')
}
