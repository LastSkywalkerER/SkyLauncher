import { ChildProcess } from 'node:child_process'

import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Payload } from '@nestjs/microservices'

import { version } from '../../../../package.json'
import { IPCHandleNames } from '../../../shared/constants'
import type { GameData, LauncherInfo } from '../../../shared/dtos/launcher.dto'
import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import type { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import { getInstallCommand } from '../installer/installer.commands'
import { getUpdateCommand } from '../updater/updater.commands'
import { LaunchModpackCommand } from './launch-modpack/launch-modpack.command'

@Controller()
export class LauncherController {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

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
    const fullVersion = new MCGameVersion(version)

    const Command = getInstallCommand(version.modpackProvider)
    const command = new Command(fullVersion)

    return (await this.commandBus.execute(command)).getData()
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
  public async handleLaunchGame(@Payload() { version }: GameData): Promise<ChildProcess> {
    const fullVersion = new MCGameVersion(version)

    const command = new LaunchModpackCommand(fullVersion)

    return await this.commandBus.execute<LaunchModpackCommand, ChildProcess>(command)
  }
}
