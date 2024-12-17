import { existsSync } from 'node:fs'

import { Inject, Logger } from '@nestjs/common'
import { CommandBus, CommandHandler } from '@nestjs/cqrs'
import { promises as fsPromises } from 'fs'
import { join } from 'path'

import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { getInstallCommand } from '../../installer/installer.commands'
import { UpdateHandlerBase } from '../updater.handler'
import { UpdateModpackCommand } from './update-modpack.command'

@CommandHandler(UpdateModpackCommand)
export class UpdateModpackHandler extends UpdateHandlerBase {
  private readonly logger = new Logger(UpdateModpackHandler.name)

  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {
    super()
  }

  public async execute({ target }: UpdateModpackCommand): Promise<MCGameVersion> {
    const localTarget = target.update({})
    const localPath = localTarget.folder!
    const localPathOld = `${localTarget.folder}_old`
    const worldsPathOld = join(localPathOld, MCGameVersion.worldsFolder)

    if (existsSync(localPath)) {
      await fsPromises.rename(localPath, localPathOld)
      this.logger.log(`Directory "${localPath}" renamed to "${localPathOld}".`)
    }

    const Command = getInstallCommand(localTarget.modpackProvider)
    const command = new Command(localTarget)

    const newTarget = await this.commandBus.execute(command)

    if (existsSync(worldsPathOld)) {
      await fsPromises.cp(worldsPathOld, join(newTarget.folder!, MCGameVersion.worldsFolder), {
        recursive: true
      })
      this.logger.log(
        `Worlds copied from "${worldsPathOld}" to "${join(newTarget.folder!, MCGameVersion.worldsFolder)}".`
      )
    }

    if (existsSync(localPathOld)) {
      await fsPromises.rm(localPathOld, { recursive: true, force: true })
      this.logger.log(`Directory "${localPathOld}" removed.`)
    }

    return newTarget
  }
}
