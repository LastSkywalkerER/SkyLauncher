import { defaultModpackIcon, forgeVersionSeparator } from '../../constants'
import {
  GameInstallationStatus,
  IMCGameVersion,
  MakeOptional,
  ServerData
} from './mc-game-version.interface'

export class MCGameVersion implements IMCGameVersion {
  icon: string
  name: string
  version: string
  fullVersion: string

  jsonUrl?: string
  folder?: string
  downloadUrl?: string
  forge?: string
  java?: string
  server?: ServerData
  status?: GameInstallationStatus
  coverImage?: string

  constructor(data: MakeOptional<IMCGameVersion, 'icon' | 'name' | 'ready' | 'fullVersion'>) {
    if (!data.folder && !data.jsonUrl && !data.downloadUrl) {
      throw Error('MC Version have no source')
    }

    this.fullVersion =
      data.fullVersion || data.forge
        ? `${data.version}${forgeVersionSeparator}${data.forge}`
        : data.version
    this.version = data.version
    this.folder = data.folder
    this.jsonUrl = data.jsonUrl
    this.name = data.name || this.fullVersion
    this.downloadUrl = data.downloadUrl
    this.icon = data.icon || defaultModpackIcon
    this.forge = data.forge
    this.java = data.java
    this.status = data.status
    this.server = data.server
    this.coverImage = data.coverImage
  }

  public getData(): IMCGameVersion {
    return {
      folder: this.folder,
      version: this.version,
      forge: this.forge,
      java: this.java,
      status: this.status,
      icon: this.icon,
      fullVersion: this.fullVersion,
      name: this.name,
      downloadUrl: this.downloadUrl,
      jsonUrl: this.jsonUrl,
      server: this.server,
      coverImage: this.coverImage
    }
  }

  public update(data: Partial<IMCGameVersion>): MCGameVersion {
    return new MCGameVersion({ ...this.getData(), ...data })
  }

  public updateStatus(status?: GameInstallationStatus): MCGameVersion {
    return new MCGameVersion({ ...this.getData(), status: { ...this.getData().status, ...status } })
  }
}
