import { Injectable } from '@nestjs/common'
import { request } from 'undici'

import { RequestData, ResponseData } from '../../../shared/dtos/request.dto'

@Injectable()
export class RequestsService {
  public async request({ url, options }: RequestData): Promise<ResponseData> {
    // const urlObject = new URL(url)

    const response = await request(url, options)

    return { ...response, body: await response.body.json() }
  }
}
