import { Module } from '@nestjs/common'
import { DownloaderService } from './downloader.service'
import { ZipDownloaderService } from './zip-downloader/zip-downloader.service'
import { DirDownloaderService } from './dir-downloader/dir-downloader.service'
import { DownloaderClientService } from './downloader-client/downloader-client.service'

@Module({
  providers: [
    DownloaderService,
    ZipDownloaderService,
    DirDownloaderService,
    DownloaderClientService
  ],
  exports: [DownloaderService]
})
export class DownloaderModule {}
