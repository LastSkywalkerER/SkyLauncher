import { CurseforgeV1Client, SearchOptions } from '@xmcl/curseforge'
import { inject, injectable } from 'inversify'
import { BehaviorSubject, combineLatest, from, map, Observable, tap } from 'rxjs'

import { RendererApi } from '../../../../shared/api/types'
import {
  getCurseForgeLinks,
  Modloader,
  modloaderList,
  ModpackProvider
} from '../../../../shared/constants'
import { MCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.entity'
import { IMCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.interface'
import { environment } from '../../shared/config/environments'
import { IBackendApi } from '../BackendApi/interfaces'
import { NodeApi } from '../NodeApi'
import { INodeApi } from '../NodeApi/interfaces'
import { IMCLocalGameVersion, IVersions } from './interfaces'

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
    this.launchGame = this.launchGame.bind(this)
    this.installGame = this.installGame.bind(this)
    this.updateGame = this.updateGame.bind(this)

    this.checkLocalMCVersions()
  }

  public async getCurseForgeModpacks(
    searchOptions: SearchOptions = {
      searchFilter: 'freshcraft',
      classId: 4471,
      pageSize: 2
      // modLoaderType: FileModLoaderType.Forge
      // modLoaderTypes: ['forge', 'fabric']
    }
  ): Promise<IMCGameVersion[]> {
    const api = new CurseforgeV1Client(environment.curseForgeApiKey)
    const result = await api.searchMods(searchOptions)

    return result.data.map((data) => {
      const mainFile = data.latestFiles.find((file) => file.id === data.mainFileId)
      const mainVersion = mainFile?.gameVersions.find((string) => string.split('.').length === 3)
      const mainModloader = mainFile?.gameVersions
        .find((string) => modloaderList.includes(string.toLowerCase() as Modloader))
        ?.toLowerCase() as Modloader

      return new MCGameVersion({
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
        modpackProvider: ModpackProvider.CurseFroge
      }).getData()
    })
  }

  public getCustomMCVersions(): Observable<IMCLocalGameVersion[]> {
    this.getCurseForgeModpacks()

    return combineLatest([
      from(this._backendApi.getCustomMCVersions()),
      this._localMCVersions,
      from(this.getCurseForgeModpacks())
    ]).pipe(
      map(([versions, installedVersions, curseForgeVersions]) => {
        // Создаем объект с установленными версиями
        const installedVersionsMap = installedVersions.reduce<Record<string, IMCGameVersion>>(
          (acc, version) => {
            acc[version.name] = version
            return acc
          },
          {}
        )

        return [...versions, ...curseForgeVersions].map((version) => {
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
    // return from(this._nodeApi.getCustomMCVersions())
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

  public launchGame(version: IMCGameVersion): void {
    from(
      this._nodeApi.launchGame({
        version
      })
    ).subscribe()
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
}
