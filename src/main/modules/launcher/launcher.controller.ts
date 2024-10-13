import { Controller, Inject } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { GameData } from '../../../dtos/launcher.dto'
import { MCGameVersion } from '../../../entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../entities/mc-game-version/mc-game-version.interface'
import { LauncherService } from './launcher.service'
import { Payload } from '@nestjs/microservices'
import { IPCHandleNames } from '../../../constants'
import { UserLoggerService } from '../user-logger/user-logger.service'

@Controller()
export class LauncherController {
  constructor(
    @Inject(LauncherService) private readonly launcherService: LauncherService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
  ) {}

  @IpcHandle(IPCHandleNames.InstallGame)
  public async handleInstallGame(@Payload() { version }: GameData): Promise<IMCGameVersion> {
    try {
      const fullVersion = new MCGameVersion(version)

      return (await this.launcherService.installCustomModpack(fullVersion)).getData()
    } catch (error) {
      this.userLoggerService.error(error)
    }
  }

  @IpcHandle(IPCHandleNames.CheckGame)
  public async handleCheckGame(@Payload() { version }: GameData): Promise<IMCGameVersion> {
    try {
      const fullVersion = new MCGameVersion(version)

      const data = (await this.launcherService.checkLocalModpack(fullVersion)).getData()

      console.log({ data })

      return data
    } catch (error) {
      this.userLoggerService.error(error)
    }
  }

  @IpcHandle(IPCHandleNames.LaunchGame)
  public async handleLaunchGame(@Payload() { version }: GameData): Promise<void> {
    try {
      const fullVersion = new MCGameVersion(version)

      await this.launcherService.launchGame(fullVersion)
    } catch (error) {
      this.userLoggerService.error(error)
    }
  }
}
