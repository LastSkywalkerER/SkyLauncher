import { Module } from '@nestjs/common'

import { DownloaderModule } from '../downloader/downloader.module'
import { LauncherController } from './launcher.controller'
import { LauncherService } from './launcher.service'

@Module({
  imports: [DownloaderModule],
  providers: [LauncherService],
  controllers: [LauncherController]
})
export class LauncherModule {}
