import { inject, injectable } from 'inversify'

import { ModpackProvider, supabaseFunctionsRoute } from '../../../../shared/constants'
import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.interface'
import { environment } from '../../shared/config/environments'
import { capitalizeFirstLetter } from '../../shared/utils/capitalizeFirstLetter'
import { IHttpClient } from '../HttpClient/interfaces'
import {
  ErrorResponse,
  IBackendApi,
  LoginData,
  LoginResponse,
  MinecraftProfileResponse,
  ProfileResponse,
  RegisterData
} from './interfaces'

@injectable()
export class BackendApi implements IBackendApi {
  private _httpClient: IHttpClient

  constructor(@inject(IHttpClient.$) httpClient: IHttpClient) {
    this._httpClient = httpClient

    this.getMinecraftProfile = this.getMinecraftProfile.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.refresh = this.refresh.bind(this)
    this.register = this.register.bind(this)
  }

  public async getMinecraftProfile(): Promise<MinecraftProfileResponse> {
    try {
      const { body } = await this._httpClient.request<MinecraftProfileResponse>({
        url: 'v1/profile/minecraft-auth'
      })

      return body
    } catch (error) {
      throw Error(
        (error as ErrorResponse)?.response?.data?.error ||
          (error as ErrorResponse)?.response?.data?.message
      )
    }
  }

  public async getProfile(): Promise<ProfileResponse> {
    const { body } = await this._httpClient.request<ProfileResponse>({
      url: 'v1/profile'
    })

    return body
  }

  public async login({ email, password }: LoginData): Promise<LoginResponse> {
    const { body } = await this._httpClient.request<LoginResponse>({
      url: 'v1/auth/login',
      method: 'POST',
      body: { email, password }
    })

    this._httpClient.setAuth({
      token: body.access_token,
      type: capitalizeFirstLetter(body.token_type)
    })

    return body
  }

  public async logout(): Promise<unknown> {
    try {
      const { body } = await this._httpClient.request<unknown>({
        url: 'v1/auth/logout',
        method: 'POST'
      })

      return body
    } catch (e) {
      throw e
    } finally {
      this._httpClient.removeAuth()
    }
  }

  public async refresh(): Promise<unknown> {
    const { body } = await this._httpClient.request<unknown>({
      url: 'v1/auth/refresh',
      method: 'POST'
    })

    return body
  }

  public async register({
    email,
    password,
    confirmPassword,
    terms
  }: RegisterData): Promise<LoginResponse> {
    const { body } = await this._httpClient.request<LoginResponse>({
      url: 'v1/auth/register',
      method: 'POST',
      body: { email, password, confirmPassword, terms }
    })

    this._httpClient.setAuth({
      token: body.access_token,
      type: capitalizeFirstLetter(body.token_type)
    })

    return body
  }

  public async getCustomMCVersions(): Promise<IMCGameVersion[]> {
    const { body: versions } = await this._httpClient.request<IMCGameVersion[]>({
      url: `${environment.supabaseBaseUrl}${supabaseFunctionsRoute}/get-versions`,
      // method: 'POST',
      headers: {
        Authorization: `Bearer ${environment.supabaseAnonKey}`
      }
    })

    return versions.map((version) => {
      return new MCGameVersion({
        ...(version as IMCGameVersion),

        modpackProvider: ModpackProvider.FreshCraft
      }).getData()
    })
  }
}
