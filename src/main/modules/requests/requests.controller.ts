import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject } from '@nestjs/common'

import { IPCHandleNames } from '../../../shared/constants'
import { type RequestData, type ResponseData } from '../../../shared/dtos/request.dto'
import { RequestsService } from './requests.service'

@Controller()
export class RequestsController {
  constructor(@Inject(RequestsService) private readonly requestsService: RequestsService) {}

  @IpcHandle(IPCHandleNames.Request)
  public request(data: RequestData): Promise<ResponseData> {
    return this.requestsService.request(data)
  }
}
