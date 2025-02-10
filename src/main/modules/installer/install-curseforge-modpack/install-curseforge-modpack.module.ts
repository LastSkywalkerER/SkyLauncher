import { Module } from '@nestjs/common'

import { UndiciDownloaderModule } from '../../../libs/downloader/undici-downloader/undici-downloader.module'
import { InstallCurseforgeModpackHandler } from './install-curseforge-modpack.handler'

@Module({
  imports: [UndiciDownloaderModule],
  providers: [InstallCurseforgeModpackHandler]
})
export class InstallCurseforgeModpackModule {}
