import { Module } from '@nestjs/common'

import { IDownloaderServiceToken } from '../downloader.interface'
import { HttpsUrlDownloaderService } from './https-url-downloader.service'

@Module({
  providers: [
    {
      provide: IDownloaderServiceToken,
      useClass: HttpsUrlDownloaderService
    },
    HttpsUrlDownloaderService
  ],
  exports: [IDownloaderServiceToken]
})
export class HttpsUrlDownloaderModule {}
