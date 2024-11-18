import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import { injectable } from 'inversify'

import { IHttpClient, RequestData, ResponseData } from './interfaces'

@injectable()
export class AxiosClient implements IHttpClient {
  private readonly _client: AxiosInstance

  constructor({ baseURL }: { baseURL: string }) {
    this._client = axios.create({
      baseURL,
      headers: {
        post: {
          'Content-Type': 'application/json'
        }
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

    return { body: response.data, statusCode: response.status }
  }

  public setAuth({ token, type = 'Bearer' }): void {
    this._client.defaults.headers.common['Authorization'] = `${type} ${token}`
  }

  public removeAuth(): void {
    delete this._client.defaults.headers.common['Authorization']
  }
}
