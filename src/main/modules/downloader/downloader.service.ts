import { Inject, Injectable } from '@nestjs/common'
import { ZipDownloaderService } from './zip-downloader/zip-downloader.service'
import { join } from 'path'
import { HardwareService } from '../hardware/hardware.service'
import { BucketNames } from '../../constants'
// import { DirDownloaderService } from './dir-downloader/dir-downloader.service'

@Injectable()
export class DownloaderService {
  constructor(
    @Inject(ZipDownloaderService) private readonly zipDownloaderService: ZipDownloaderService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService
    // @Inject(DirDownloaderService) private readonly dirDownloaderService: DirDownloaderService
  ) {}

  public async downloadJava(version: string, debug: (data: string) => void): Promise<string> {
    const platform = this.hardwareService.getPlatform()
    const architecture = this.hardwareService.getArchitecture()
    const appDir = await this.hardwareService.getAppDir()

    return this.zipDownloaderService.downloadAndUnzip({
      bucketName: BucketNames.Java,
      debug,
      destinationPath: join(appDir, 'java'),
      zipPath: join(platform, architecture),
      version
    })
  }

  public async downloadModpack(name: string, debug: (data: string) => void): Promise<string> {
    const appDir = await this.hardwareService.getAppDir()

    return this.zipDownloaderService.downloadAndUnzip({
      bucketName: BucketNames.Modpacks,
      debug,
      destinationPath: join(appDir, BucketNames.Modpacks),
      version: name,
      zipPath: '/'
    })
  }
}
