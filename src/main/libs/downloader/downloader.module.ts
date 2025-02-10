import { Module } from '@nestjs/common'

import { HttpsUrlDownloaderModule } from './https-url-downloader/https-url-downloader.module'
import { UndiciDownloaderModule } from './undici-downloader/undici-downloader.module'

@Module({
  imports: [HttpsUrlDownloaderModule, UndiciDownloaderModule]
})
export class DownloaderModule {}
