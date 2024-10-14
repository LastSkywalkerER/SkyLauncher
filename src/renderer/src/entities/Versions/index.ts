import { inject, injectable } from 'inversify'
import { BehaviorSubject, from, Observable, tap } from 'rxjs'
import { RendererApi } from '../../../../api/types'

import { IMCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.interface'
import { NodeApi } from '../NodeApi'
import { INodeApi } from '../NodeApi/interfaces'
import { IVersions } from './interfaces'

@injectable()
export class Versions implements IVersions {
  private readonly _version: BehaviorSubject<IMCGameVersion> = new BehaviorSubject(null)
  private _nodeApi: RendererApi
  private _localMCVersions = new BehaviorSubject<IMCGameVersion[]>([])

  constructor(@inject(INodeApi.$) nodeApi: NodeApi) {
    this._nodeApi = nodeApi.getMainProcessApi()

    this._nodeApi.getLocalMCVersions().then((data) => this._localMCVersions.next(data))

    this.getCustomMCVersions = this.getCustomMCVersions.bind(this)
    this.checkLocalMCVersions = this.checkLocalMCVersions.bind(this)
    this.getLocalMCVersions = this.getLocalMCVersions.bind(this)
    this.getCurrentMCVersion = this.getCurrentMCVersion.bind(this)
    this.setCurrentMCVersion = this.setCurrentMCVersion.bind(this)
    this.launchGame = this.launchGame.bind(this)
    this.checkGame = this.checkGame.bind(this)
    this.installGame = this.installGame.bind(this)
  }

  public getCustomMCVersions(): Observable<IMCGameVersion[]> {
    return from(this._nodeApi.getCustomMCVersions())
  }

  public checkLocalMCVersions(): void {
    from(this._nodeApi.getLocalMCVersions())
      .pipe(tap((data) => this._localMCVersions.next(data)))
      .subscribe()
  }

  public getLocalMCVersions(): Observable<IMCGameVersion[]> {
    return this._localMCVersions
  }

  public getCurrentMCVersion(): Observable<IMCGameVersion> {
    return this._version
  }

  public setCurrentMCVersion(version: IMCGameVersion): void {
    this.checkGame(version)
    this._version.next(version)
  }

  public launchGame(version: IMCGameVersion): void {
    from(
      this._nodeApi.launchGame({
        version
      })
    ).subscribe()
  }

  public checkGame(version: IMCGameVersion): void {
    from(
      this._nodeApi.checkGame({
        version
      })
    ).subscribe((data) => {
      console.log(data)
      this._version.next(data)
    })
  }

  public installGame(version: IMCGameVersion): void {
    from(
      this._nodeApi.installGame({
        version
      })
    )
      .pipe(
        tap((data) => {
          this._version.next(data)
          this.checkLocalMCVersions()
        })
      )
      .subscribe()
  }
}
