import { Controller, Inject } from '@nestjs/common'
import { IMCGameVersion } from '../../../entities/mc-game-version/mc-game-version.interface'
import { IpcHandle } from '@doubleshot/nest-electron'
import { IPCHandleNames } from '../../../constants'
import { VersionsService } from './versions.service'

@Controller()
export class VersionsController {
  constructor(@Inject(VersionsService) private readonly versionsService: VersionsService) {}

  @IpcHandle(IPCHandleNames.GetCustomMCVersions)
  public async handleGetCustomMCVersions(): Promise<IMCGameVersion[]> {
    return await this.versionsService.getCustomModpacksVersions()
  }

  @IpcHandle(IPCHandleNames.GetLocalMCVersions)
  public async handleGetLocalMCVersions(): Promise<IMCGameVersion[]> {
    return await this.versionsService.getLocalVersions()
  }
}
