import { Inject, Injectable } from '@nestjs/common'
import { Version } from '@xmcl/core'
import { getForgeVersionList, getVersionList } from '@xmcl/installer'
import { join } from 'path'
import { forgeVersionSeparator, versionsFolder } from '../../../constants'
import {
  imageFields,
  MCGameVersion
} from '../../../entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../entities/mc-game-version/mc-game-version.interface'

import { findFoldersWithTargetFolder } from '../../utils/filesystem/findFoldersWithTargetFolder'
import { getFoldersInDirectory } from '../../utils/filesystem/getFoldersInDirectory'
import { UserConfigService } from '../user-config/user-config.service'
import { UserLoggerService } from '../user-logger/user-logger.service'

import { versions } from './versions.mock'
import { promises as fsPromises } from 'fs'

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

    const foundModpacksVersions: MCGameVersion[] = await Promise.all(
      foundModpacks.map(async ({ path, name }) => {
        const versionDirs = await getFoldersInDirectory({
          dir: join(path, versionsFolder),
          onError: this.userLoggerService.error
        })

        const version = versionDirs.reduce((acc, { name: versionName }) => {
          const finalVersion = { ...acc, name, folder: path }

          if (versionName.includes(forgeVersionSeparator)) {
            const [mcVersion, forgeVersion] = versionName.split(forgeVersionSeparator)

            return { ...finalVersion, version: mcVersion, forge: forgeVersion }
          }

          return { ...finalVersion, version: versionName }
        }, {} as IMCGameVersion)

        return new MCGameVersion({ ...version })
      })
    )

    const resolvedVersions: (MCGameVersion | undefined)[] = await Promise.all(
      foundModpacksVersions.map(async (version): Promise<MCGameVersion | undefined> => {
        if (!version.folder) {
          return
        }

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

        try {
          const resolvedVersion = await Version.parse(version.folder, version.fullVersion)

          // const issueReport = await diagnose(resolvedVersion.id, resolvedVersion.minecraftDirectory)

          // if (issueReport.issues.length === 0) {
          return version.update({ java: String(resolvedVersion.javaVersion.majorVersion) })
          // }
          //
          // this.userLoggerService.error(
          //   `Issues in ${version.folder} with version ${version.name}: `,
          //   issueReport
          // )
        } catch (error) {
          this.userLoggerService.error(
            `Error in ${version.folder} with version ${version.name}: `,
            error
          )
        }

        return
      })
    )

    return resolvedVersions.filter((data) => !!data)
  }
}
