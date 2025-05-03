import { inject, injectable } from 'inversify'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { RendererApi } from '../../../../../shared/api/types'
import { IMCGameVersion } from '../../../../../shared/entities/mc-game-version/mc-game-version.interface'
import { NodeApi } from '../../../shared/api/NodeApi/index'
import { INodeApi } from '../../../shared/api/NodeApi/interfaces'
import { ISingleProcessProgress } from '../../../widgets/SingleProgressBar/service'
import { ILauncherControlService } from './interfaces'

@injectable()
export class LauncherControlService implements ILauncherControlService {
  private _nodeApi: RendererApi

  constructor(
    @inject(INodeApi.$) nodeApi: NodeApi,
    @inject(ISingleProcessProgress.$)
    private readonly _singleProcessProgress: ISingleProcessProgress
  ) {
    this._nodeApi = nodeApi.getMainProcessApi()

    this.launchGame = this.launchGame.bind(this)
    this.isProcessActive = this.isProcessActive.bind(this)
  }

  public launchGame(version: IMCGameVersion): Observable<void> {
    // TODO: Check User Name

    return from(
      this._nodeApi.launchGame({
        version
      })
    )
  }

  public isProcessActive(): Observable<boolean> {
    return this._singleProcessProgress.data$.pipe(map((data) => data !== null))
  }
}
