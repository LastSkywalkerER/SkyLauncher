import { Module } from '@nestjs/common'

import { HttpsUrlDownloaderModule } from '../../downloader/https-url-downloader/https-url-downloader.module'
import { InstallCurseforgeModpackHandler } from './install-curseforge-modpack.handler'

@Module({
  imports: [HttpsUrlDownloaderModule],
  providers: [InstallCurseforgeModpackHandler]
})
export class InstallCurseforgeModpackModule {}
