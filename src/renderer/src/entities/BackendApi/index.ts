import { inject, injectable } from 'inversify'

import { capitalizeFirstLetter } from '../../shared/utils/capitalizeFirstLetter'
import { IHttpClient } from '../HttpClient/interfaces'
import { IBackendApi, LoginData, LoginResponse, ProfileResponse, RegisterData } from './interfaces'

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

  public async getMinecraftProfile(): Promise<unknown> {
    const { body } = await this._httpClient.request<unknown>({
      url: 'v1/profile/minecraft'
    })

    return body
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
    const { body } = await this._httpClient.request<unknown>({
      url: 'v1/auth/logout',
      method: 'POST'
    })

    this._httpClient.removeAuth()

    return body
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
}
