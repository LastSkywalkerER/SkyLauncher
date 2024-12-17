import { existsSync } from 'node:fs'

import { Inject, Injectable } from '@nestjs/common'
import { join } from 'path'

import { BucketNames } from '../../../shared/constants'
import { HardwareService } from '../hardware/hardware.service'
import { UserConfigService } from '../user-config/user-config.service'
import { UserLoggerService } from '../user-logger/user-logger.service'
import { ZipDownloaderService } from './zip-downloader/zip-downloader.service'

@Injectable()
export class DownloaderService {
  constructor(
    @Inject(ZipDownloaderService) private readonly zipDownloaderService: ZipDownloaderService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
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
      objectPath: this.hardwareService.multiplatformJoin(platform, architecture),
      outputDirectory
    })

    await this.zipDownloaderService.unzip({
      zipPath,
      outputDirectory: join(outputDirectory, platform, architecture)
    })

    return zipPath.replace('.zip', '')
  }
}
