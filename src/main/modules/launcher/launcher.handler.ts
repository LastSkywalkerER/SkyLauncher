import { ChildProcess } from 'node:child_process'

import { ICommandHandler } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import { LaunchCommandBase } from './launcher.command'
import { LauncherEvents } from './launcher-events.typs'

export abstract class LaunchHandlerBase
  implements ICommandHandler<LaunchCommandBase, ChildProcess>
{
  constructor(protected readonly eventEmitter: EventEmitter2) {}

  public abstract execute(command: LaunchCommandBase): Promise<ChildProcess>

  protected emitModpackLaunched(gameVersion: IMCGameVersion): void {
    this.eventEmitter.emit(LauncherEvents.ModpackLaunched, gameVersion)
  }

  protected emitModpackClosed(gameVersion: IMCGameVersion): void {
    this.eventEmitter.emit(LauncherEvents.ModpackClosed, gameVersion)
  }
}
