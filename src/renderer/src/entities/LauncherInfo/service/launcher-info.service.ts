import { INodeApi } from '@renderer/shared/api/NodeApi/interfaces'
import { LauncherInfo } from '@shared/dtos/launcher.dto'
import { inject, injectable } from 'inversify'
import { finalize, from, Observable, tap } from 'rxjs'

import { LoadableState } from '../../LoadableState'
import { ILauncherInfo } from '../interfaces'

@injectable()
export class LauncherInfoService extends LoadableState<LauncherInfo> implements ILauncherInfo {
  private _nodeApi: INodeApi

  constructor(@inject(INodeApi.$) nodeApi: INodeApi) {
    super()

    this._nodeApi = nodeApi

    this.refreshLauncherInfo = this.refreshLauncherInfo.bind(this)
    this.getLauncherInfo = this.getLauncherInfo.bind(this)

    // Инициализируем данные при создании сервиса
    this.init()
  }

  private init(): void {
    this.refreshLauncherInfo().subscribe()
  }

  public getLauncherInfo(): LauncherInfo {
    return this.data$.getValue() as LauncherInfo
  }

  public refreshLauncherInfo(): Observable<LauncherInfo> {
    this.isLoading$.next(true)
    this.isLoaded$.next(false)

    return from(this._nodeApi.getMainProcessApi().getLauncherInfo()).pipe(
      tap((launcherInfo: LauncherInfo) => {
        this.data$.next(launcherInfo)
      }),
      finalize(() => {
        this.isLoaded$.next(true)
        this.isLoading$.next(false)
      })
    )
  }
}
