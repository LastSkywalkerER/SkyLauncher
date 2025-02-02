import { ModpackProvider } from '../../../shared/constants'
import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { UpdateModpackCommand } from './update-modpack/update-modpack.command'
import { UpdateCommandBase } from './updater.command'

class CommandNotImplemented extends UpdateCommandBase {
  constructor(public readonly target: MCGameVersion) {
    super(target)

    throw Error(`${target.modpackProvider} updater not implemented`)
  }
}

export const updateCommands = {
  [ModpackProvider.Local]: CommandNotImplemented,
  [ModpackProvider.Native]: CommandNotImplemented,
  [ModpackProvider.Forge]: CommandNotImplemented,
  [ModpackProvider.FreshCraft]: UpdateModpackCommand,
  [ModpackProvider.CurseFroge]: CommandNotImplemented
}

export const getUpdateCommand = <T extends ModpackProvider>(
  source: T
): (typeof updateCommands)[T] => updateCommands[source]
