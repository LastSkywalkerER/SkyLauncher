import { Module } from '@nestjs/common'

import { HttpsUrlDownloaderModule } from './https-url-downloader/https-url-downloader.module'

@Module({
  imports: [HttpsUrlDownloaderModule]
})
export class DownloaderModule {}
