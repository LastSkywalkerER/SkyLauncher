import { existsSync } from 'node:fs'

import { Inject } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { join } from 'path'

import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import {
  type IDownloaderService,
  IDownloaderServiceToken
} from '../../../libs/downloader/downloader.interface'
import { JavaService } from '../../../libs/java/java.service'
import { UnzipService } from '../../../libs/unzip/unzip.service'
import { InstallerService } from '../../../libs/xmcl-core/installer.service'
import { removeNestedDirectories } from '../../../utils/filesystem/removeNestedDirectories'
import { MetadataService } from '../../metadata/metadata.service'
import { UserConfigService } from '../../user-config/user-config.service'
import { InstallHandlerBase } from '../installer.handler'
import { InstallModpackCommand } from './install-modpack.command'

@CommandHandler(InstallModpackCommand)
export class InstallModpackHandler extends InstallHandlerBase {
  constructor(
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(IDownloaderServiceToken) private readonly downloaderService: IDownloaderService,
    @Inject(UnzipService) private readonly unzipService: UnzipService,
    @Inject(MetadataService) private readonly metadataService: MetadataService,
    @Inject(JavaService) private readonly javaService: JavaService,
    @Inject(InstallerService) private readonly installerService: InstallerService
  ) {
    super()
  }

  public async execute({ target }: InstallModpackCommand): Promise<MCGameVersion> {
    const localTarget = target.update({})
    const installPath = join(
      this.userConfigService.get('modpacksPath'),
      localTarget.name
      // 'Better MC [FORGE] 1.20.1 v36'
    )

    // if (!localTarget.folder && !existsSync(installPath)) {
    //   mkdirSync(installPath)
    //
    //   localTarget.update({ folder: installPath })
    // } else if (!localTarget.folder && existsSync(installPath)) {
    //   localTarget.update({ folder: installPath })
    // }

    if (!(await this.javaService.isJavaExecutableExists(localTarget.java))) {
      await this.javaService.install(localTarget.java)
    }

    if (!existsSync(installPath)) {
      const downloadResponse = await this.downloaderService.download({
        fileName: `${localTarget.name}.zip`,
        outputDirectory: installPath,
        fileUrl: localTarget.downloadUrl
      })

      console.log({ downloadResponse })

      const unzipResponse = await this.unzipService.execute({
        inputPath: downloadResponse.filePath,
        outputPath: installPath
      })

      console.log({ unzipResponse })

      // Extract .minecraft, if exists
      const folderWithoutDotMinecraft = await removeNestedDirectories(
        unzipResponse.filePath,
        MCGameVersion.defaultMinecraftPath
      )
      console.log({ folderWithoutDotMinecraft })
      // Extract duplicated nested folder, if exists
      const folderWithoutNest = await removeNestedDirectories(
        folderWithoutDotMinecraft,
        localTarget.name
      )

      console.log({ folderWithoutNest })

      localTarget.update({ folder: folderWithoutNest })
    } else {
      localTarget.update({ folder: installPath })
    }

    if (!localTarget.folder) {
      throw Error(`Problem with file path for ${localTarget.name}`)
    }

    localTarget.update(await this.installerService.install(localTarget))
    localTarget.update(await this.installerService.installModloader(localTarget))

    await this.metadataService.safe(localTarget)

    return localTarget
  }
}
