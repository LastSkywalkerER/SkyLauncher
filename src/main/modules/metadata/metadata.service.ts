import { readdir } from 'node:fs/promises'

import { Inject, Injectable } from '@nestjs/common'
import { Version } from '@xmcl/core'
import { existsSync, mkdirSync, promises as fsPromises } from 'fs'
import { join } from 'path'

import { defaultModpackIcon, ModpackProvider } from '../../../shared/constants'
import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import {
  type IDownloaderService,
  IDownloaderServiceToken
} from '../../libs/downloader/downloader.interface'
import { UserConfigService } from '../user-config/user-config.service'

@Injectable()
export class MetadataService {
  constructor(
    @Inject(IDownloaderServiceToken) private readonly downloaderService: IDownloaderService,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService
  ) {}

  public async safe(version: MCGameVersion): Promise<void> {
    console.log({ version })
    const newMetadata = version.getData()
    console.log({ newMetadata })
    MCGameVersion.imageFields.forEach((field) => delete newMetadata[field])
    const fsMetadata = new MCGameVersion(newMetadata)
    // const ramMetadata = new MCGameVersion(newMetadata)

    await Promise.all(
      MCGameVersion.imageFields.map(async (field) => {
        if (version[field]) {
          const downloadResponse = await this.downloaderService.download({
            fileUrl: version[field] as string,
            fileName: `${field}.png`,
            outputDirectory: join(version.folder!, MCGameVersion.metadataDirName)
          })

          // const file = await fsPromises.readFile(downloadResponse.filePath, 'base64')

          fsMetadata.update({ [field]: downloadResponse.filePath })
          // ramMetadata.update({ [field]: `data:image/png;base64,${file}` })
        }
      })
    )

    await this.update(fsMetadata.getData())
  }

  public async update(newMetadata: IMCGameVersion): Promise<void> {
    if (!newMetadata.folder || !existsSync(newMetadata.folder)) {
      throw Error('Modpack not installed')
    }

    const filePath = join(
      newMetadata.folder,
      MCGameVersion.metadataDirName,
      MCGameVersion.metadataJsonName
    )

    const dir = join(newMetadata.folder, MCGameVersion.metadataDirName)

    if (existsSync(filePath)) {
      const fileData = await fsPromises.readFile(filePath, 'utf8')

      const jsonContent = JSON.parse(fileData) as IMCGameVersion

      const updatedData = { ...jsonContent, ...newMetadata }

      await fsPromises.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8')
    } else {
      if (!existsSync(dir)) {
        mkdirSync(dir)
      }

      await fsPromises.writeFile(filePath, JSON.stringify(newMetadata, null, 2), 'utf8')
    }
  }

  public async parse(modpackFolderName: string): Promise<IMCGameVersion | null> {
    const modpacksDir = this.userConfigService.get('modpacksPath')
    const modpackPath = join(modpacksDir, modpackFolderName)

    const metadataPath = join(
      modpackPath,
      MCGameVersion.metadataDirName,
      MCGameVersion.metadataJsonName
    )

    if (existsSync(metadataPath)) {
      const fileData = await fsPromises.readFile(metadataPath, 'utf8')
      const metadata = JSON.parse(fileData) as IMCGameVersion

      await Promise.all(
        MCGameVersion.imageFields.map(async (field) => {
          if (metadata[field] && existsSync(metadata[field] as string)) {
            const file = await fsPromises.readFile(metadata[field] as string, 'base64')

            metadata[field as never] = `data:image/png;base64,${file}` as never
          }
        })
      )

      return metadata
    }

    const versionsPath = join(modpackPath, MCGameVersion.versionsFolder)

    if (!existsSync(versionsPath)) {
      return null
    }

    const items = await readdir(versionsPath, { withFileTypes: true })
    const versions = items.filter((item) => item.isDirectory()).map((item) => item.name)

    const resolvedVersions = (
      await Promise.all(
        versions.map(async (version) => {
          try {
            return await Version.parse(modpackPath, version)
          } catch (error) {
            return null
          }
        })
      )
    ).filter((item) => !!item)
    const currentResolvedVersion = resolvedVersions[0]
    const { version, modloaderVersion, modloader } = MCGameVersion.parseFullVersion(
      currentResolvedVersion.id
    )

    return {
      folder: modpackPath,
      name: modpackFolderName,
      modpackProvider: ModpackProvider.Local,
      version,
      modloader,
      modloaderVersion,
      icon: defaultModpackIcon,
      fullVersion: currentResolvedVersion.id,
      java: String(currentResolvedVersion.javaVersion.majorVersion),
      status: {
        assets: !!currentResolvedVersion.assets,
        native: true,
        libs: !!currentResolvedVersion.libraries.length,
        modloader: !!modloader
      }
    }
  }
}
