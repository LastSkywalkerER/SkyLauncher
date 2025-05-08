import { IUser } from '@renderer/entities/User'
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
    private readonly _singleProcessProgress: ISingleProcessProgress,
    @inject(IUser.$) private readonly _user: IUser
  ) {
    this._nodeApi = nodeApi.getMainProcessApi()

    this.launchGame = this.launchGame.bind(this)
    this.isProcessActive = this.isProcessActive.bind(this)
  }

  public launchGame(version: IMCGameVersion): Observable<void> {
    const user = this._user.getUser()

    if (!user.userName) {
      throw new Error('Microsoft Account is required')
    }

    return from(
      this._nodeApi.launchGame({
        version,
        user: {
          userName: user.userName,
          userId: user.userId,
          accessToken: user.accessToken
        }
      })
    )
  }

  public isProcessActive(): Observable<boolean> {
    return this._singleProcessProgress.data$.pipe(map((data) => data !== null))
  }
}
