import { existsSync } from 'node:fs'

import { Inject } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { mkdirSync } from 'fs'
import { join } from 'path'

import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { JavaService } from '../../java/java.service'
import { MetadataService } from '../../metadata/metadata.service'
import { UserConfigService } from '../../user-config/user-config.service'
import { InstallHandlerBase } from '../installer.handler'
import { InstallerService } from '../installer.service'
import { InstallForgeCommand } from './install-forge.command'

@CommandHandler(InstallForgeCommand)
export class InstallForgeHandler extends InstallHandlerBase {
  constructor(
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(MetadataService) private readonly metadataService: MetadataService,
    @Inject(JavaService) private readonly javaService: JavaService,
    @Inject(InstallerService) private readonly installerService: InstallerService
  ) {
    super()
  }

  public async execute({ target }: InstallForgeCommand): Promise<MCGameVersion> {
    const localTarget = target.update({})
    const installPath = join(this.userConfigService.get('modpacksPath'), localTarget.name)

    if (!(await this.javaService.isJavaExecutableExists(localTarget.java))) {
      await this.javaService.install(localTarget.java)
    }

    if (!existsSync(installPath)) {
      mkdirSync(installPath)
    }

    localTarget.update({ folder: installPath })

    localTarget.update(await this.installerService.install(localTarget))
    // localTarget.update(await this.installerService.installVersion(localTarget))
    // localTarget.update(await this.installerService.installAssets(localTarget))
    // localTarget.update(await this.installerService.installLibraries(localTarget))
    localTarget.update(await this.installerService.installForge(localTarget))

    await this.metadataService.safe(localTarget)

    return localTarget
  }
}
