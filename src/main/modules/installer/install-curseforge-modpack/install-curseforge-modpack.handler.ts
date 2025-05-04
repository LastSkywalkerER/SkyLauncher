import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rename, rmdir } from 'node:fs/promises'

import { prettyLogObject } from '@main/utils/pretty-log-object'
import { Inject, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandHandler } from '@nestjs/cqrs'
import { CurseforgeV1Client } from '@xmcl/curseforge'
import { join } from 'path'

import { getCurseForgeLinks } from '../../../../shared/constants'
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
import { InstallCurseforgeModpackCommand } from './install-curseforge-modpack.command'
import { ManifestCurseForge } from './install-curseforge-modpack.interface'

@CommandHandler(InstallCurseforgeModpackCommand)
export class InstallCurseforgeModpackHandler extends InstallHandlerBase {
  private readonly _logger = new Logger(InstallCurseforgeModpackHandler.name)

  private readonly _curseForgeApi: CurseforgeV1Client

  constructor(
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(IDownloaderServiceToken) private readonly downloaderService: IDownloaderService,
    @Inject(UnzipService) private readonly unzipService: UnzipService,
    @Inject(MetadataService) private readonly metadataService: MetadataService,
    @Inject(JavaService) private readonly javaService: JavaService,
    @Inject(InstallerService) private readonly installerService: InstallerService,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {
    super()

    this._curseForgeApi = new CurseforgeV1Client(this.configService.get('curseForgeApiKey')!)
  }

  public async execute({ target }: InstallCurseforgeModpackCommand): Promise<MCGameVersion> {
    const localTarget = target.update({})
    const installPath = join(
      this.userConfigService.get('modpacksPath'),
      // localTarget.name.replace(/[()\[\]{}<>.,:;!?'"`~\-–—_/\\|@#$%^&*+=]/g, ''),
      // 'FreshCraft'
      localTarget.name
    )

    this._logger.log(`Installing: ${prettyLogObject(localTarget)} to ${installPath}`)

    // Recheck install folder
    // if (!localTarget.folder! && !existsSync(installPath)) {
    //   mkdirSync(installPath)
    //
    //   localTarget.update({ folder: installPath })
    // } else if (!localTarget.folder! && existsSync(installPath)) {
    //   localTarget.update({ folder: installPath })
    // }

    if (!(await this.javaService.isJavaExecutableExists(localTarget.java))) {
      await this.javaService.install(localTarget.java)
    }

    // Download main dir
    if (!existsSync(installPath)) {
      const downloadResponse = await this.downloaderService.download({
        fileName: `${localTarget.name}.zip`,
        outputDirectory: installPath,
        fileUrl: localTarget.downloadUrl
      })

      const unzipResponse = await this.unzipService.execute({
        inputPath: downloadResponse.filePath,
        outputPath: installPath
      })

      const folder = await removeNestedDirectories(unzipResponse.filePath, localTarget.name)

      localTarget.update({ folder })
    } else {
      localTarget.update({ folder: installPath })
    }

    const manifestPath = join(localTarget.folder!, MCGameVersion.manifestName)
    if (!existsSync(manifestPath)) {
      throw Error(`Something wrong with CurseForge modpack ${localTarget.name}`)
    }

    const fileContents = await readFile(manifestPath, 'utf-8')
    const jsonData = JSON.parse(fileContents) as ManifestCurseForge
    this._logger.log(`Manifest: ${prettyLogObject(jsonData)}`)
    const overridesPath = join(localTarget.folder!, jsonData.overrides || 'overrides')
    const modsPath = join(localTarget.folder!, MCGameVersion.modsFolder)

    // Get modpack data from overrides folder
    if (existsSync(overridesPath)) {
      const itemsInSingleDirectory = await readdir(overridesPath)
      this._logger.log(`Overrides: ${prettyLogObject(itemsInSingleDirectory)}`)
      for (const item of itemsInSingleDirectory) {
        const srcPath = join(overridesPath, item)
        const destPath = join(localTarget.folder!, item)
        await rename(srcPath, destPath)
      }
      await rmdir(overridesPath)
      this._logger.log(`Overrides removed`)
    }

    // Download mods
    if (localTarget.modloader && !localTarget.status.mods) {
      if (!existsSync(modsPath)) {
        await mkdir(modsPath)
      }

      this._logger.log(`Downloading mods ${prettyLogObject(jsonData.files)}`)
      await Promise.all(
        jsonData.files.map(async ({ fileID, projectID }) => {
          const result = await this._curseForgeApi.getModFile(projectID, fileID)

          await this.downloaderService.download({
            fileName: result.fileName,
            outputDirectory: modsPath,
            fileUrl: result.downloadUrl,
            additionalUrls: getCurseForgeLinks({ fileID, fileName: result.fileName })
          })
        })
      )

      localTarget.updateStatus({ mods: true })
      this._logger.log(`Downloaded mods`)
    }

    localTarget.update(await this.installerService.install(localTarget))
    // localTarget.update(await this.installerService.installVersion(localTarget))
    // localTarget.update(await this.installerService.installLibraries(localTarget))
    // try {
    //   localTarget.update(await this.installerService.installAssets(localTarget))
    // } catch (e) {}
    // await pauseTimer()
    // localTarget.update(await this.installerService.installAssets(localTarget))
    localTarget.update(await this.installerService.installModloader(localTarget))

    await this.metadataService.safe(localTarget)

    return localTarget
  }
}
