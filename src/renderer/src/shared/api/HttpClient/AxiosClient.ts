import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import { injectable } from 'inversify'

import { IHttpClient, RequestData, ResponseData } from './interfaces'

@injectable()
export class AxiosClient implements IHttpClient {
  private readonly _accessStorageKey = 'access_token'

  private readonly _client: AxiosInstance

  constructor({ baseURL }: { baseURL: string }) {
    let additionalHeaders = {}

    const accessToken = localStorage.getItem(this._accessStorageKey)

    if (accessToken) {
      additionalHeaders = {
        common: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }

    this._client = axios.create({
      baseURL,
      headers: {
        post: {
          'Content-Type': 'application/json'
        },
        ...additionalHeaders
      }
    })

    this.request = this.request.bind(this)
  }

  public async request<T>({ url, method, headers, body }: RequestData): Promise<ResponseData<T>> {
    const response = await this._client.request({
      url,
      data: JSON.stringify(body),
      method: method,
      headers: headers as RawAxiosRequestHeaders
    })

    return { body: response.data, statusCode: response?.status }
  }

  public setAuth({ token, type = 'Bearer' }: { token: string; type?: string }): void {
    this._client.defaults.headers.common['Authorization'] = `${type} ${token}`
    localStorage.setItem(this._accessStorageKey, token)
  }

  public removeAuth(): void {
    delete this._client.defaults.headers.common['Authorization']
    localStorage.removeItem(this._accessStorageKey)
  }
}
