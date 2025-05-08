import { IMCGameVersion } from '../entities/mc-game-version/mc-game-version.interface'

export interface GameData {
  version: IMCGameVersion
}

export interface GameDataWithUser extends GameData {
  user: MCUser
}

export interface PartialGameData {
  version: Partial<IMCGameVersion>
}

export interface LauncherInfo {
  version: string
  platform: string
  arch: string
}

export interface MCUser {
  userName: string
  userId?: string
  accessToken?: string
}
