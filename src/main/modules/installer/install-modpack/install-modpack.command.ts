import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { InstallCommandBase } from '../installer.command'

export class InstallModpackCommand extends InstallCommandBase {
  constructor(public readonly target: MCGameVersion) {
    super(target)
  }
}
