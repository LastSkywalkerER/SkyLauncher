import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'

import { IPCHandleNames } from '../../../shared/constants'
import { type ConfigKeys, type UserConfigData } from '../../../shared/dtos/config.dto'
import { UserConfigService } from './user-config.service'

@Controller()
export class UserConfigController {
  constructor(@Inject(UserConfigService) private readonly userConfigService: UserConfigService) {}

  @IpcHandle(IPCHandleNames.SetConfig)
  public setConfig(@Payload() config: UserConfigData): void {
    this.userConfigService.set(config)
  }

  @IpcHandle(IPCHandleNames.GetConfig)
  public getConfig<T extends ConfigKeys>(@Payload() key: T): UserConfigData[T] {
    return this.userConfigService.get(key)
  }
}
