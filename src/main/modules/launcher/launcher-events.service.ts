import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import type { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import { WindowService } from '../window/window.service'
import { LauncherEvents } from './launcher-events.typs'

@Injectable()
export class LauncherEventsService {
  private readonly logger = new Logger(LauncherEventsService.name)

  constructor(@Inject(WindowService) private readonly windowService: WindowService) {}

  @OnEvent(LauncherEvents.ModpackLaunched)
  handleModpackLaunched(gameVersion: IMCGameVersion): void {
    this.logger.log(`Handling modpackLaunched event for ${gameVersion.name}`)
    this.windowService.minimizeWindow()
  }

  @OnEvent(LauncherEvents.ModpackClosed)
  handleModpackClosed(gameVersion: IMCGameVersion): void {
    this.logger.log(`Handling modpackClosed event for ${gameVersion.name}`)
    this.windowService.restoreWindow()
  }
}
