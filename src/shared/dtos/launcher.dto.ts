import { IMCGameVersion } from '../entities/mc-game-version/mc-game-version.interface'

export interface GameData {
  version: IMCGameVersion
}

export interface PartialGameData {
  version: Partial<IMCGameVersion>
}

export interface LauncherInfo {
  version: string
  platform: string
  arch: string
}
