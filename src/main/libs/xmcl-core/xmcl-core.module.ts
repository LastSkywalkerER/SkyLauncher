import { Global, Module } from '@nestjs/common'

import { UndiciDownloaderModule } from '../downloader/undici-downloader/undici-downloader.module'
import { InstallerService } from './installer.service'

@Global()
@Module({
  imports: [UndiciDownloaderModule],
  providers: [InstallerService],
  exports: [InstallerService]
})
export class XmclCoreModule {}
