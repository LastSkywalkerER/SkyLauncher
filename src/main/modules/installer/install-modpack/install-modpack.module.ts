import { Module } from '@nestjs/common'

import { UndiciDownloaderModule } from '../../../libs/downloader/undici-downloader/undici-downloader.module'
import { InstallModpackHandler } from './install-modpack.handler'

@Module({
  imports: [UndiciDownloaderModule],
  providers: [InstallModpackHandler]
})
export class InstallModpackModule {}
