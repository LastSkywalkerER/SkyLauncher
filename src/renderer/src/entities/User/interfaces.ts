import { MCUser } from '@shared/dtos/launcher.dto'
import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { LoginData, LoginResponse, RegisterData } from '../../shared/api/BackendApi/interfaces'
import { ILoadableState } from '../LoadableState/interfaces'

export interface UserData {
  // MCUser
  userName?: MCUser['userName']
  userId?: MCUser['userId']
  accessToken?: MCUser['accessToken']

  // Api User
  email?: string
  icon?: string
  isOffline?: boolean
  role?: string
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
