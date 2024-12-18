import { Inject, Injectable } from '@nestjs/common'
import { Version } from '@xmcl/core'
import { getForgeVersionList, getVersionList } from '@xmcl/installer'
import { promises as fsPromises } from 'fs'
import { join } from 'path'

import { forgeVersionSeparator, versionsFolder } from '../../../shared/constants'
import {
  imageFields,
  MCGameVersion
} from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import { findFoldersWithTargetFolder } from '../../utils/filesystem/findFoldersWithTargetFolder'
import { getFoldersInDirectory } from '../../utils/filesystem/getFoldersInDirectory'
import { sortVersions } from '../../utils/versionSorter'
import { UserConfigService } from '../user-config/user-config.service'
import { UserLoggerService } from '../user-logger/user-logger.service'
import { versions } from './versions.mock'

@Injectable()
export class VersionsService {
  constructor(
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
  ) {}

  public async getNativeVersions(versions?: string[]): Promise<IMCGameVersion[]> {
    const availableVersions = await getVersionList()

    const nativeVersions: (IMCGameVersion & {
      jsonUrl: string
      version: string
      name: string
    })[] = availableVersions.versions.map(
      ({ url, id }) =>
        new MCGameVersion({
          jsonUrl: url,
          version: id,
          name: id
        }) as IMCGameVersion & {
          jsonUrl: string
          version: string
          name: string
        }
    )

    if (versions) {
      return nativeVersions.filter((value) => versions.includes(value.version))
    }

    return nativeVersions
  }

  public async getForgeVersions(version: string): Promise<IMCGameVersion[]> {
    const availableForgeList = await getForgeVersionList({
      minecraft: version
    })

    const nativeVersion = (await this.getNativeVersions([version]))[0]

    return availableForgeList.versions.map(
      ({ mcversion, version }) =>
        new MCGameVersion({
          jsonUrl: nativeVersion.jsonUrl,
          version: mcversion,
          forge: version
        })
    )
  }

  public async getCustomModpacksVersions(): Promise<IMCGameVersion[]> {
    const nativeVersions = await this.getNativeVersions()

    const responseVersion = versions.map((version) => {
      const jsonUrl = nativeVersions.find(
        ({ version: nativeVersion }) => version.version === nativeVersion
      )?.jsonUrl

      return new MCGameVersion({ ...version, jsonUrl }).getData()
    })

    return responseVersion
  }

  public async getLocalVersions(): Promise<IMCGameVersion[]> {
    const modpacksDir = this.userConfigService.get('modpacksPath')

    const foundModpacks = await findFoldersWithTargetFolder({
      dir: modpacksDir,
      targetFolder: versionsFolder,
      onError: this.userLoggerService.error
    })

    const foundModpacksVersions: (MCGameVersion | null)[] = await Promise.all(
      foundModpacks.map(async ({ path, name }) => {
        const versionDirs = await getFoldersInDirectory({
          dir: join(path, versionsFolder),
          onError: this.userLoggerService.error
        })

        const resolvedVersions = await Promise.all(
          versionDirs.map(async ({ name: versionName }) => {
            try {
              return await Version.parse(path, versionName)
            } catch (error) {
              return null
            }
          })
        )
        const resolvedVersionName = sortVersions(
          resolvedVersions
            .map((resolvedVersion) => resolvedVersion?.id)
            .filter((data) => !!data) as string[]
        )[0]
        const [mcVersion, forgeVersion] = resolvedVersionName.split(forgeVersionSeparator)
        const resolvedVersion = resolvedVersions.find(
          (version) => version?.id === resolvedVersionName
        )

        if (!resolvedVersion) {
          return null
        }

        const version = new MCGameVersion({
          version: mcVersion,
          forge: forgeVersion,
          name,
          folder: path
        })

        const metadata = await version.getMetadata()

        if (metadata) {
          await Promise.all(
            imageFields.map(async (field) => {
              if (metadata[field]) {
                const file = await fsPromises.readFile(metadata[field] as string, 'base64')

                version.update({ [field]: `data:image/png;base64,${file}` })
              }
            })
          )
        }

        return version.update({ java: String(resolvedVersion.javaVersion.majorVersion) })
      })
    )

    return foundModpacksVersions.filter((data) => !!data) as MCGameVersion[]
  }
}
