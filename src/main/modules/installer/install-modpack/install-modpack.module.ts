import { Module } from '@nestjs/common'

import { HttpsUrlDownloaderModule } from '../../downloader/https-url-downloader/https-url-downloader.module'
import { InstallModpackHandler } from './install-modpack.handler'

@Module({
  imports: [HttpsUrlDownloaderModule],
  providers: [InstallModpackHandler]
})
export class InstallModpackModule {}
