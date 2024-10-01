import { Inject, Injectable } from '@nestjs/common'
import { ZipDownloaderService } from './zip-downloader/zip-downloader.service'
import { join } from 'path'
import { getAppDir } from '../../utils/window/getAppDir'
import { DirDownloaderService } from './dir-downloader/dir-downloader.service'

@Injectable()
export class DownloaderService {
  constructor(
    @Inject(ZipDownloaderService) private readonly zipDownloaderService: ZipDownloaderService,
    @Inject(DirDownloaderService) private readonly dirDownloaderService: DirDownloaderService
  ) {}

  public async downloadJava(version: string, debug: (data: string) => void): Promise<string> {
    return this.zipDownloaderService.downloadAndUnzip({
      bucketName: 'java',
      debug,
      destinationPath: join(await getAppDir(), 'java'),
      zipPath: process.platform === 'win32' ? join('win', 'x64') : join('mac', 'arm64'),
      version
    })
  }

  public async downloadModpack(name: string, debug: (data: string) => void): Promise<string> {
    return this.zipDownloaderService.downloadAndUnzip({
      bucketName: 'modpacks',
      debug,
      destinationPath: join(await getAppDir(), 'modpacks'),
      version: name,
      zipPath: '/'
    })
  }
}
