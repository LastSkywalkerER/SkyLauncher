import { ICommandHandler } from '@nestjs/cqrs'

import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { InstallCommandBase } from './installer.command'

export abstract class InstallHandlerBase
  implements ICommandHandler<InstallCommandBase, MCGameVersion>
{
  public abstract execute(command: InstallCommandBase): Promise<MCGameVersion>
}
