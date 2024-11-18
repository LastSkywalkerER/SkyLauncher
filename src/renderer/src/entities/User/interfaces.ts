import { interfaces } from 'inversify'

import { UserConfigData } from '../../../../shared/dtos/config.dto'
import { LoginData, RegisterData } from '../BackendApi/interfaces'
import { ILoadableState } from '../LoadableState/interfaces'

export interface UserData {
  userId: UserConfigData['userId']
  userName: UserConfigData['userName']
  accessToken: string
}

export interface IUser extends ILoadableState<UserData> {
  getUser: () => UserData

  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  getMinecraftProfile: () => Promise<unknown>
  getProfile: () => Promise<unknown>
}

export namespace IUser {
  export const $: interfaces.ServiceIdentifier<IUser> = Symbol('IUser')
}
