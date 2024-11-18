import * as fs from 'fs'
import { join } from 'path'

import { defaultModpackCover, defaultModpackIcon, forgeVersionSeparator } from '../../constants'
import {
  GameInstallationStatus,
  IMCGameVersion,
  MakeOptional,
  ServerData
} from './mc-game-version.interface'

const metadataJsonName = 'info.json'
export const imageFields: (keyof IMCGameVersion)[] = ['icon', 'coverImage', 'titleImage']

export class MCGameVersion implements IMCGameVersion {
  public metadataDirName = 'metadata'

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
  titleImage?: string
  title?: string
  description?: string

  constructor(data: MakeOptional<IMCGameVersion, 'icon' | 'name' | 'fullVersion'>) {
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
    this.coverImage = data.coverImage || defaultModpackCover
    this.titleImage = data.titleImage
    this.title = data.title
    this.description = data.description
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
      coverImage: this.coverImage,
      description: this.description,
      title: this.title,
      titleImage: this.titleImage
    }
  }

  public update(data: Partial<IMCGameVersion>): MCGameVersion {
    Object.assign(this as object, data)
    return this
  }

  public async updateMetadata(newMetadata: Partial<IMCGameVersion>): Promise<void> {
    if (!this.folder) {
      throw Error('Modpack not installed')
    }

    const filePath = join(this.folder, this.metadataDirName, metadataJsonName)

    const dir = join(this.folder, this.metadataDirName)

    try {
      if (fs.existsSync(filePath)) {
        const fileData = await fs.promises.readFile(filePath, 'utf8')

        const jsonContent = JSON.parse(fileData) as IMCGameVersion

        const updatedData = { ...jsonContent, ...newMetadata }

        await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8')
      } else {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }

        await fs.promises.writeFile(filePath, JSON.stringify(newMetadata, null, 2), 'utf8')
      }
    } catch (error) {
      console.error('Metadata file error:', error)
    }
  }

  public async getMetadata(): Promise<IMCGameVersion | null> {
    if (!this.folder) {
      throw Error('Modpack not installed')
    }

    const filePath = join(this.folder, this.metadataDirName, metadataJsonName)

    try {
      if (fs.existsSync(filePath)) {
        const fileData = await fs.promises.readFile(filePath, 'utf8')
        const jsonContent = JSON.parse(fileData) as IMCGameVersion

        return jsonContent
      } else {
        return null
      }
    } catch (error) {
      console.error('Error with reading metadata:', error)
      return null
    }
  }

  public updateStatus(status?: GameInstallationStatus): MCGameVersion {
    Object.assign(this as object, { status: { ...this.getData().status, ...status } })
    return this
  }
}
