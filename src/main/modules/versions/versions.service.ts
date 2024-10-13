import { Inject, Injectable } from '@nestjs/common'
import { diagnose, ResolvedVersion, Version } from '@xmcl/core'
import { getForgeVersionList, getVersionList } from '@xmcl/installer'
import { join } from 'path'
import { forgeVersionSeparator, versionsFolder } from '../../../constants'
import { MCGameVersion } from '../../../entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../entities/mc-game-version/mc-game-version.interface'

import { findFoldersWithTargetFolder } from '../../utils/filesystem/findFoldersWithTargetFolder'
import { getFoldersInDirectory } from '../../utils/filesystem/getFoldersInDirectory'
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

    const nativeVersions: IMCGameVersion[] = availableVersions.versions.map(
      ({ url, id }) =>
        new MCGameVersion({
          jsonUrl: url,
          version: id,
          name: id
        })
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
      ).jsonUrl

      return new MCGameVersion({ ...version, jsonUrl }).getData()
    })

    return responseVersion
  }

  public async getLocalVersions(): Promise<IMCGameVersion[]> {
    const modpacksDir = this.userConfigService.get<'directoriesPaths.modpacks'>(
      'directoriesPaths.modpacks'
    )

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

    const resolvedVersions: MCGameVersion[] = await Promise.all(
      foundModpacksVersions.map(async (version) => {
        try {
          const resolvedVersion = await Version.parse(version.folder, version.fullVersion)

          const issueReport = await diagnose(resolvedVersion.id, resolvedVersion.minecraftDirectory)

          if (issueReport.issues.length === 0) {
            return version.update({ java: String(resolvedVersion.javaVersion.majorVersion) })
          }

          this.userLoggerService.error(
            `Issues in ${version.folder} with version ${version.name}: `,
            issueReport
          )
        } catch (error) {
          this.userLoggerService.error(
            `Error in ${version.folder} with version ${version.name}: `,
            error
          )
        }
      })
    )

    return resolvedVersions.filter((data) => !!data)
  }
}
