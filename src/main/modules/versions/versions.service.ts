import { Injectable } from '@nestjs/common'
import { getForgeVersionList, getVersionList } from '@xmcl/installer'

import { Modloader, ModpackProvider } from '../../../shared/constants'
import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'

@Injectable()
export class VersionsService {
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
          name: id,
          modpackProvider: ModpackProvider.Native
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
          modloader: Modloader.Forge,
          modloaderVersion: version,
          modpackProvider: ModpackProvider.Forge
        })
    )
  }
}
