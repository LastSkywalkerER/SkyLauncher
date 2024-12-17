import { Module } from '@nestjs/common'

import { LaunchModpackModule } from './launch-modpack/launch-modpack.module'
import { LauncherController } from './launcher.controller'

@Module({
  imports: [LaunchModpackModule],
  controllers: [LauncherController]
})
export class LauncherModule {}
