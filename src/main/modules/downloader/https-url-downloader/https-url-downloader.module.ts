import { Module } from '@nestjs/common'

import { IDownloaderServiceToken } from '../downloader.interface'
import { HttpsUrlDownloaderService } from './https-url-downloader.service'

@Module({
  providers: [
    {
      provide: IDownloaderServiceToken,
      useClass: HttpsUrlDownloaderService
    },
    {
      provide: 'TEMP_EXT',
      useValue: '.temp'
    },
    HttpsUrlDownloaderService
  ],
  exports: [IDownloaderServiceToken]
})
export class HttpsUrlDownloaderModule {}
