import { MCUser } from '@shared/dtos/launcher.dto'

import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { LaunchCommandBase } from '../launcher.command'

export class LaunchModpackCommand extends LaunchCommandBase {
  constructor(
    public readonly target: MCGameVersion,
    public readonly user: MCUser
  ) {
    super(target, user)
  }
}
