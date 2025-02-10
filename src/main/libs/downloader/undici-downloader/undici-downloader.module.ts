import { Module } from '@nestjs/common'
import { Agent, Dispatcher, interceptors } from 'undici'

import { IDownloaderServiceToken } from '../downloader.interface'
import { UndiciDownloaderService } from './undici-downloader.service'

@Module({
  providers: [
    {
      provide: 'UNDICI_CLIENT',

      useFactory: (): Dispatcher =>
        new Agent({
          connections: 10,
          pipelining: 1,
          maxRedirections: 5
        }).compose(interceptors.retry(), interceptors.redirect())
    },
    {
      provide: IDownloaderServiceToken,
      useClass: UndiciDownloaderService
    },
    UndiciDownloaderService
  ],
  exports: [IDownloaderServiceToken, 'UNDICI_CLIENT']
})
export class UndiciDownloaderModule {}
