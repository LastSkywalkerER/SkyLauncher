import { inject, injectable } from 'inversify'
import { from, Observable } from 'rxjs'

import defaultIcon from '../../../../../resources/icons/icon.png'
import {
  IBackendApi,
  LoginData,
  LoginResponse,
  ProfileResponse,
  RegisterData
} from '../BackendApi/interfaces'
import { LoadableState } from '../LoadableState'
import { ISettings } from '../Settings/interfaces'
import { IUser, UserData } from './interfaces'

@injectable()
export class User extends LoadableState<UserData> implements IUser {
  private _backendApi: IBackendApi
  private _settings: ISettings

  constructor(
    @inject(IBackendApi.$) backendApi: IBackendApi,
    @inject(ISettings.$) settings: ISettings
  ) {
    super()

    this._backendApi = backendApi
    this._settings = settings

    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.offlineLogin = this.offlineLogin.bind(this)
    this.getMinecraftProfile = this.getMinecraftProfile.bind(this)
    this.getProfile = this.getProfile.bind(this)

    this.isLoaded$.next(true)
    this.isLoading$.next(false)
  }

  getUser(): UserData {
    return this.data$.getValue() as UserData
  }

  public login(data: LoginData): Observable<LoginResponse> {
    const handleLogin = async (): Promise<LoginResponse> => {
      this.isLoading$.next(true)

      const resposne = await this._backendApi.login(data)

      console.log('login', { resposne })

      this.data$.next({ email: data.email, icon: defaultIcon })

      console.log('login', { email: data.email, icon: defaultIcon })

      this.isLoaded$.next(true)
      this.isLoading$.next(false)

      return resposne
    }

    return from(handleLogin())
  }

  public logout(): Observable<unknown> {
    this.data$.next(null)

    return from(this._backendApi.logout())
  }

  public register(data: RegisterData): Observable<LoginResponse> {
    return from(this._backendApi.register(data))
  }

  public offlineLogin({ userName }: UserData): void {
    try {
      const oldData = this.data$.getValue()

      this._settings.setSettings({
        userName
      })

      this.data$.next({ ...oldData, userName, icon: defaultIcon })
    } catch (error) {
      this.error$.next(error as Error)
    } finally {
      this.isLoaded$.next(true)
      this.isLoading$.next(false)
    }
  }

  public async getMinecraftProfile(): Promise<void> {
    const oldData = this.data$.getValue()

    this.isLoaded$.next(false)
    this.isLoading$.next(true)

    try {
      const response = await this._backendApi.getMinecraftProfile()

      if (!response?.username) {
        throw Error('Something went wrong')
      }

      this._settings.setSettings({
        userName: response.username,
        userId: response.uuid,
        accessToken: response.minecraft_access_token,
        minecraftAccessExpiration: response.minecraft_access_expires_in
      })

      this.data$.next({ ...oldData, userName: response.username })
    } catch (error) {
      this.error$.next(error as Error)
    } finally {
      this.isLoaded$.next(true)
      this.isLoading$.next(false)
    }
  }

  public async getProfile(): Promise<ProfileResponse> {
    const response = await this._backendApi.getProfile()

    return response
  }
}
