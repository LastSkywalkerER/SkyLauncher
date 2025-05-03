import { CurseforgeV1Client, SearchOptions } from '@xmcl/curseforge'
import { inject, injectable } from 'inversify'
import { BehaviorSubject, combineLatest, from, map, Observable, of, tap } from 'rxjs'

import { RendererApi } from '../../../../../shared/api/types'
import {
  getCurseForgeLinks,
  Modloader,
  modloaderList,
  ModpackProvider
} from '../../../../../shared/constants'
import { MCGameVersion } from '../../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../../../shared/entities/mc-game-version/mc-game-version.interface'
import { sortVersions } from '../../../../../shared/utils/versionSorter'
import { environment } from '../../../app/config/environments'
import { IBackendApi } from '../../../shared/api/BackendApi/interfaces'
import { NodeApi } from '../../../shared/api/NodeApi'
import { INodeApi } from '../../../shared/api/NodeApi/interfaces'
import { IMCLocalGameVersion, IVersions } from '../interfaces'

@injectable()
export class Versions implements IVersions {
  private readonly _version: BehaviorSubject<IMCGameVersion | null> =
    new BehaviorSubject<IMCGameVersion | null>(null)
  private _nodeApi: RendererApi
  private _backendApi: IBackendApi
  private _localMCVersions = new BehaviorSubject<IMCGameVersion[]>([])

  constructor(
    @inject(INodeApi.$) nodeApi: NodeApi,
    @inject(IBackendApi.$) backendApi: IBackendApi
  ) {
    this._nodeApi = nodeApi.getMainProcessApi()
    this._backendApi = backendApi

    this.getCustomMCVersions = this.getCustomMCVersions.bind(this)
    this.checkLocalMCVersions = this.checkLocalMCVersions.bind(this)
    this.getLocalMCVersions = this.getLocalMCVersions.bind(this)
    this.getCurrentMCVersion = this.getCurrentMCVersion.bind(this)
    this.setCurrentMCVersion = this.setCurrentMCVersion.bind(this)
    this.installGame = this.installGame.bind(this)
    this.updateGame = this.updateGame.bind(this)
    this.getModpackVersions = this.getModpackVersions.bind(this)
    this.updateLocalMCVersion = this.updateLocalMCVersion.bind(this)
    this.checkLocalMCVersions()
  }

  public getCurseForgeModpacks(
    searchOptions: SearchOptions = {
      searchFilter: 'freshcraft',
      classId: 4471,
      pageSize: 3,
      sortField: 5
    }
  ): Observable<IMCGameVersion[]> {
    const api = new CurseforgeV1Client(environment.curseForgeApiKey)

    return from(api.searchMods(searchOptions)).pipe(
      map((result) => {
        return result.data.map((data) => {
          const mainFile = data.latestFiles.find((file) => file.id === data.mainFileId)
          const mainVersion = mainFile?.gameVersions.find(
            (string) => string.split('.').length === 3
          )
          const mainModloader = mainFile?.gameVersions
            .find((string) => modloaderList.includes(string.toLowerCase() as Modloader))
            ?.toLowerCase() as Modloader

          return new MCGameVersion({
            id: String(data.id),
            name: mainFile?.fileName.replace('.zip', ''),
            icon: data.logo.url,
            coverImage: data.screenshots[0]?.url,
            downloadUrl:
              mainFile?.downloadUrl || (mainFile?.fileName && mainFile?.id)
                ? getCurseForgeLinks({ fileID: mainFile.id!, fileName: mainFile.fileName! })[0]
                : '',
            version: mainVersion!,
            modloader: mainModloader,
            description: data.summary,
            title: data.name,
            modpackProvider: ModpackProvider.CurseFroge,
            modpackVersion: mainFile?.fileName
              ? mainFile.fileName.match(/\d+\.\d+\.\d+/)?.[0]
              : undefined
          }).getData()
        })
      })
    )
  }

  public getCustomMCVersions(): Observable<IMCLocalGameVersion[]> {
    return combineLatest([
      from(this._backendApi.getCustomMCModpacks()).pipe(
        map((modpacks) => {
          return modpacks.map((modpack) => {
            const latestModpackVersion = sortVersions(
              modpack.versions
                .filter((version) => version.modpackVersion)
                .map((version) => version.modpackVersion!)
            )[0]

            return modpack.versions.find(
              (version) => version.modpackVersion === latestModpackVersion
            )!
          })
        })
      ),

      this._localMCVersions
    ]).pipe(
      map(([versions, installedVersions]) => {
        // Создаем объект с установленными версиями
        const installedVersionsMap = installedVersions.reduce<Record<string, IMCGameVersion>>(
          (acc, version) => {
            acc[version.name] = version
            return acc
          },
          {}
        )

        return versions.map((version) => {
          const installedVersion = installedVersionsMap[version.name]

          return {
            ...installedVersion,
            ...(version && {
              ...Object.keys(version).reduce((acc, key) => {
                if (version[key]) {
                  acc[key] = version[key]
                }
                return acc
              }, {} as Partial<IMCGameVersion>)
            }),
            isInstalled: !!installedVersion
          }
        })
      })
    )
  }

  public getModpackVersions(modpackName: string): Observable<IMCLocalGameVersion[]> {
    return combineLatest([
      from(this._backendApi.getCustomMCModpacks()).pipe(
        map((modpacks) => {
          const modpack = modpacks.find((modpack) => modpack.name === modpackName)
          return modpack?.versions || []
        })
      ),
      this._localMCVersions
    ]).pipe(
      map(([versions, installedVersions]) => {
        const installedVersionsMap = installedVersions.reduce<Record<string, IMCGameVersion>>(
          (acc, version) => {
            acc[version.name] = version
            return acc
          },
          {}
        )

        return versions.map((version) => {
          const installedVersion = installedVersionsMap[version.name]

          return {
            ...installedVersion,
            ...(version && {
              ...Object.keys(version).reduce((acc, key) => {
                if (version[key]) {
                  acc[key] = version[key]
                }
                return acc
              }, {} as Partial<IMCGameVersion>)
            }),
            isInstalled: !!installedVersion
          }
        })
      })
    )
  }

  public checkLocalMCVersions(): void {
    from(this._nodeApi.getLocalMCVersions())
      .pipe(
        tap((data) => {
          this._localMCVersions.next(data)
        })
      )
      .subscribe()
  }

  public getLocalMCVersions(): Observable<IMCGameVersion[]> {
    return this._localMCVersions
  }

  public getCurrentMCVersion(): Observable<IMCGameVersion | null> {
    return this._version
  }

  public setCurrentMCVersion(version: IMCGameVersion): void {
    this._version.next(version)
  }

  public installGame(version: IMCGameVersion): Observable<IMCGameVersion> {
    return from(
      this._nodeApi.installGame({
        version
      })
    ).pipe(
      tap((data) => {
        this._version.next(data)
        this.checkLocalMCVersions()
      })
    )
  }

  public updateGame(version: IMCGameVersion): Observable<IMCGameVersion> {
    return from(
      this._nodeApi.updateGame({
        version
      })
    ).pipe(
      tap((data) => {
        this._version.next(data)
        this.checkLocalMCVersions()
      })
    )
  }

  public updateLocalMCVersion(version: Partial<IMCGameVersion>): Observable<void> {
    const currentVersion = this._version.getValue()
    if (!currentVersion) return of()

    return from(this._nodeApi.updateLocalMCVersion({ version })).pipe(
      tap(() => {
        this._version.next({ ...currentVersion, ...version })
        this.checkLocalMCVersions()
      })
    )
  }
}
