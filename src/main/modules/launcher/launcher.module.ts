import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { LaunchModpackModule } from './launch-modpack/launch-modpack.module'
import { LauncherController } from './launcher.controller'
import { LauncherEventsService } from './launcher-events.service'

@Module({
  imports: [LaunchModpackModule, EventEmitterModule.forRoot()],
  controllers: [LauncherController],
  providers: [LauncherEventsService]
})
export class LauncherModule {}
