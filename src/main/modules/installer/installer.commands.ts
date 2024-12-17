import { ModpackProvider } from '../../../shared/constants'
import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { InstallCurseforgeModpackCommand } from './install-curseforge-modpack/install-curseforge-modpack.command'
import { InstallForgeCommand } from './install-forge/install-forge.command'
import { InstallModpackCommand } from './install-modpack/install-modpack.command'
import { InstallNativeCommand } from './install-native/install-native.command'
import { InstallCommandBase } from './installer.command'

class CommandNotImplemented extends InstallCommandBase {
  constructor(public readonly target: MCGameVersion) {
    super(target)

    throw Error(`${target.modpackProvider} installer not implemented`)
  }
}

export const installCommands = {
  [ModpackProvider.Local]: CommandNotImplemented,
  [ModpackProvider.Native]: InstallNativeCommand,
  [ModpackProvider.Forge]: InstallForgeCommand,
  [ModpackProvider.FreshCraft]: InstallModpackCommand,
  [ModpackProvider.CurseFroge]: InstallCurseforgeModpackCommand
}

export const getInstallCommand = <T extends ModpackProvider>(
  source: T
): (typeof installCommands)[T] => installCommands[source]
