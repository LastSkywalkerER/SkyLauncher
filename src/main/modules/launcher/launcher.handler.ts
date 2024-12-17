import { ChildProcess } from 'node:child_process'

import { ICommandHandler } from '@nestjs/cqrs'

import { LaunchCommandBase } from './launcher.command'

export abstract class LaunchHandlerBase
  implements ICommandHandler<LaunchCommandBase, ChildProcess>
{
  public abstract execute(command: LaunchCommandBase): Promise<ChildProcess>
}
