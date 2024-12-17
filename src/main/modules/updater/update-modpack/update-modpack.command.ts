import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { UpdateCommandBase } from '../updater.command'

export class UpdateModpackCommand extends UpdateCommandBase {
  constructor(public readonly target: MCGameVersion) {
    super(target)
  }
}
