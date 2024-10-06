import { Controller, Inject } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { Payload } from '@nestjs/microservices'
import { ConfigKeys } from './user-config.types'
import { UserConfigService } from './user-config.service'
import { IPCHandleNames } from '../../constants'

export interface SetConfig {
  key: ConfigKeys
  value: unknown
}

export interface GetConfig {
  key: ConfigKeys
}

@Controller()
export class UserConfigController {
  constructor(@Inject(UserConfigService) private readonly userConfigService: UserConfigService) {}

  @IpcHandle(IPCHandleNames.SetConfig)
  public setConfig(@Payload() { key, value }: SetConfig): void {
    this.userConfigService.set(key, value)
  }

  @IpcHandle(IPCHandleNames.GetConfig)
  public getConfig(@Payload() { key }: GetConfig): unknown {
    return this.userConfigService.get(key)
  }
}
