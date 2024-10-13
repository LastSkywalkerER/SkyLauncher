import { Controller, Inject } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { Payload } from '@nestjs/microservices'
import { ConfigKeys, UserConfigData } from '../../../dtos/config.dto'

import { UserConfigService } from './user-config.service'
import { IPCHandleNames } from '../../../constants'

@Controller()
export class UserConfigController {
  constructor(@Inject(UserConfigService) private readonly userConfigService: UserConfigService) {}

  @IpcHandle(IPCHandleNames.SetConfig)
  public setConfig(@Payload() config: UserConfigData): void {
    this.userConfigService.set(config)
  }

  @IpcHandle(IPCHandleNames.GetConfig)
  public getConfig(@Payload() key: ConfigKeys): unknown {
    return this.userConfigService.get(key)
  }
}
