import { inject, injectable } from 'inversify'

import { IBackendApi, LoginData, ProfileResponse, RegisterData } from '../BackendApi/interfaces'
import { LoadableState } from '../LoadableState'
import { IUser, UserData } from './interfaces'

@injectable()
export class User extends LoadableState<UserData> implements IUser {
  private _backendApi: IBackendApi

  constructor(@inject(IBackendApi.$) backendApi: IBackendApi) {
    super()

    this._backendApi = backendApi

    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.getMinecraftProfile = this.getMinecraftProfile.bind(this)
    this.getProfile = this.getProfile.bind(this)

    this.isLoaded$.next(true)
    this.isLoading$.next(false)
  }

  getUser(): UserData {
    return this.data$.getValue() as UserData
  }

  public async login(data: LoginData): Promise<void> {
    this.isLoaded$.next(false)
    this.isLoading$.next(true)

    try {
      const response = await this._backendApi.login(data)

      // console.log({ decodedJwt: jwtDecode(response.access_token) })

      const profile = await this.getProfile()

      // try {
      //   const minecraftProfile = await this.getMinecraftProfile()
      //
      //   console.log(minecraftProfile)
      // } catch (error) {
      //   console.error(error)
      // }

      this.data$.next({
        userId: '',
        userName: profile.email.value,
        accessToken: response.access_token
      } as UserData)
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoaded$.next(true)
      this.isLoading$.next(false)
    }
  }

  public async register(data: RegisterData): Promise<void> {
    await this._backendApi.register(data)
  }

  public async getMinecraftProfile(): Promise<unknown> {
    const response = await this._backendApi.getMinecraftProfile()

    return response
  }

  public async getProfile(): Promise<ProfileResponse> {
    const response = await this._backendApi.getProfile()

    return response
  }
}
