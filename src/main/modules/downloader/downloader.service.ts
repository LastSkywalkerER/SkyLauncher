import { Inject, Injectable } from '@nestjs/common'
import { existsSync } from 'node:fs'
import { MCGameVersion } from '../../../entities/mc-game-version/mc-game-version.entity'
import { UserConfigService } from '../user-config/user-config.service'
import { UserLoggerService } from '../user-logger/user-logger.service'
import { ZipDownloaderService } from './zip-downloader/zip-downloader.service'
import { join } from 'path'
import { HardwareService } from '../hardware/hardware.service'
import { BucketNames } from '../../../constants'
// import { DirDownloaderService } from './dir-downloader/dir-downloader.service'

@Injectable()
export class DownloaderService {
  constructor(
    @Inject(ZipDownloaderService) private readonly zipDownloaderService: ZipDownloaderService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    // @Inject(ProcessProgressService) private readonly processProgressService: ProcessProgressService,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
    // @Inject(DirDownloaderService) private readonly dirDownloaderService: DirDownloaderService
  ) {}

  public async downloadJava(version?: string): Promise<string> {
    const platform = this.hardwareService.getPlatform()
    const architecture = this.hardwareService.getArchitecture()
    const fileName = version || String(this.userConfigService.get('javaArgsVersion'))
    const outputDirectory = this.userConfigService.get('javaPath')
    const extractedFileCheckPath = join(outputDirectory, platform, architecture, fileName)

    if (existsSync(extractedFileCheckPath)) {
      this.userLoggerService.info(
        `Extracted files already exist in ${extractedFileCheckPath}, skipping extraction.`
      )
      return extractedFileCheckPath
    }

    const zipPath = await this.zipDownloaderService.downloadFromS3({
      bucketName: BucketNames.Java,
      fileName,
      objectPath: join(platform, architecture),
      outputDirectory
    })

    await this.zipDownloaderService.unzip({
      zipPath,
      outputDirectory: zipPath.replace(`/${fileName}.zip`, '')
    })

    return zipPath.replace('.zip', '')
  }

  public async downloadModpack(version: MCGameVersion): Promise<string> {
    const outputDirectory = this.userConfigService.get('modpacksPath')
    const extractedFileCheckPath = join(outputDirectory, version.name)

    if (existsSync(extractedFileCheckPath)) {
      this.userLoggerService.info(
        `Extracted files already exist in ${extractedFileCheckPath}, skipping extraction.`
      )
      return extractedFileCheckPath
    }

    const zipPath = await this.zipDownloaderService.downloadFromUrl({
      fileName: version.name,
      outputDirectory,
      fileUrl: version.downloadUrl!
    })

    await this.zipDownloaderService.unzip({ zipPath, outputDirectory })

    return zipPath.replace('.zip', '')
  }
}
