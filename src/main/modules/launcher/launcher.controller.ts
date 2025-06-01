import { ChildProcess } from 'node:child_process'

import { IpcHandle } from '@doubleshot/nest-electron'
import { prettyLogObject } from '@main/utils/pretty-log-object'
import { Controller, Inject, Logger } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Payload } from '@nestjs/microservices'

import { version } from '../../../../package.json'
import { defaultJavaArgs, IPCHandleNames } from '../../../shared/constants'
import type { GameData, GameDataWithUser, LauncherInfo } from '../../../shared/dtos/launcher.dto'
import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import type { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import { getInstallCommand } from '../installer/installer.commands'
import { getUpdateCommand } from '../updater/updater.commands'
import { UserConfigService } from '../user-config/user-config.service'
import { LaunchModpackCommand } from './launch-modpack/launch-modpack.command'

@Controller()
export class LauncherController {
  private readonly logger = new Logger(LauncherController.name)

  constructor(
    @Inject(CommandBus) private readonly commandBus: CommandBus,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService
    // @Inject(ProcessProgressService) private readonly processProgressService: ProcessProgressService
  ) {}

  @IpcHandle(IPCHandleNames.GetLauncherInfo)
  public getLauncherInfo(): LauncherInfo {
    return {
      version,
      platform: process.platform,
      arch: process.arch
    }
  }

  @IpcHandle(IPCHandleNames.InstallGame)
  public async handleInstallGame(
    @Payload() { version }: GameData
  ): Promise<IMCGameVersion | undefined> {
    const fullVersion = new MCGameVersion({
      ...version,
      width: this.userConfigService.get('resolutionWidth'),
      height: this.userConfigService.get('resolutionHeight'),
      fullscreen: this.userConfigService.get('resolutionFullscreen'),
      javaArgsMinMemory: this.userConfigService.get('javaArgsMinMemory'),
      javaArgsMaxMemory: this.userConfigService.get('javaArgsMaxMemory'),
      java: String(this.userConfigService.get('javaArgsVersion')),
      javaArgs: defaultJavaArgs
    })

    this.logger.log(`Installing game ${prettyLogObject(fullVersion)}`)

    const Command = getInstallCommand(version.modpackProvider)
    const command = new Command(fullVersion)

    const result = await this.commandBus.execute(command)

    return result.getData()
  }

  @IpcHandle(IPCHandleNames.UpdateGame)
  public async handleUpdateGame(
    @Payload() { version }: GameData
  ): Promise<IMCGameVersion | undefined> {
    const fullVersion = new MCGameVersion(version)

    const Command = getUpdateCommand(version.modpackProvider)
    const command = new Command(fullVersion)

    return (await this.commandBus.execute(command)).getData()
  }

  @IpcHandle(IPCHandleNames.LaunchGame)
  public async handleLaunchGame(
    @Payload() { version, user }: GameDataWithUser
  ): Promise<ChildProcess> {
    const fullVersion = new MCGameVersion(version)

    const command = new LaunchModpackCommand(fullVersion, user)
    const result = await this.commandBus.execute<LaunchModpackCommand, ChildProcess>(command)

    return result
  }
}
