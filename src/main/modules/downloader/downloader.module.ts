import { Module } from '@nestjs/common'

import { DirDownloaderService } from './dir-downloader/dir-downloader.service'
import { DownloaderService } from './downloader.service'
import { DownloaderClientService } from './downloader-client/downloader-client.service'
import { HttpsUrlDownloaderModule } from './https-url-downloader/https-url-downloader.module'
import { UrlDownloaderService } from './url-downloader/url-downloader.service'
import { ZipDownloaderService } from './zip-downloader/zip-downloader.service'

@Module({
  providers: [
    DownloaderService,
    ZipDownloaderService,
    DirDownloaderService,
    DownloaderClientService,
    UrlDownloaderService
  ],
  exports: [DownloaderService],
  imports: [HttpsUrlDownloaderModule]
})
export class DownloaderModule {}
