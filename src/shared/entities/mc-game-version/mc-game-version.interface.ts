import { Modloader, ModpackProvider } from '../../constants'

export interface IMCGameVersion {
  jsonUrl?: string
  downloadUrl?: string
  folder?: string
  version: string
  fullVersion: string
  java?: string
  icon: string
  coverImage?: string
  name: string
  status?: GameInstallationStatus
  server?: ServerData
  titleImage?: string
  title?: string
  description?: string
  modpackProvider: ModpackProvider

  id?: string
  modpackName?: string
  modpackVersion?: string

  modloader?: Modloader
  modloaderVersion?: string
}

export interface GameInstallationStatus {
  assets?: boolean
  native?: boolean
  forge?: boolean
  libs?: boolean
  modloader?: boolean
  mods?: boolean
}

export interface ServerData {
  ip: string
  port?: number
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
