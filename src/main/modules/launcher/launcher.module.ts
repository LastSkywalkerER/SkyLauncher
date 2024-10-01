import { Module } from '@nestjs/common'
import { LauncherService } from './launcher.service'
import { LauncherController } from './launcher.controller'
import { DownloaderModule } from '../downloader/downloader.module'

@Module({
  imports: [DownloaderModule],
  providers: [LauncherService],
  controllers: [LauncherController]
})
export class LauncherModule {}
