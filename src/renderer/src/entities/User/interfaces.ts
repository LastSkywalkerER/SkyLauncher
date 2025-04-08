import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { UserConfigData } from '../../../../shared/dtos/config.dto'
import { LoginData, LoginResponse, RegisterData } from '../../shared/api/BackendApi/interfaces'
import { ILoadableState } from '../LoadableState/interfaces'

export interface UserData {
  // userId: UserConfigData['userId']
  userName?: UserConfigData['userName']
  email?: string
  icon?: string
  isOffline?: boolean
  // accessToken: string
}

export interface IUser extends ILoadableState<UserData> {
  getUser: () => UserData

  login: (data: LoginData) => Observable<LoginResponse>
  logout: () => Observable<unknown>
  register: (data: RegisterData) => Observable<LoginResponse>
  offlineLogin: (data: UserData) => Observable<void>
  getMinecraftProfile: () => Promise<void>
  getProfile: () => Promise<unknown>
}

export namespace IUser {
  export const $: interfaces.ServiceIdentifier<IUser> = Symbol('IUser')
}
