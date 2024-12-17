import { ICommandHandler } from '@nestjs/cqrs'

import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { UpdateCommandBase } from './updater.command'

export abstract class UpdateHandlerBase
  implements ICommandHandler<UpdateCommandBase, MCGameVersion>
{
  public abstract execute(command: UpdateCommandBase): Promise<MCGameVersion>
}
