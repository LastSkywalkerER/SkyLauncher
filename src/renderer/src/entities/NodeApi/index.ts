import { injectable } from 'inversify'
import { ReplaySubject, Subscription } from 'rxjs'

import { RendererApi } from '../../../../api/types'
import { ConfigKeys, UserConfigData } from '../../../../dtos/config.dto'
import { INodeApi } from './interfaces'

@injectable()
export class NodeApi implements INodeApi {
  private _nodeApi: RendererApi
  private _logs$ = new ReplaySubject<undefined | string>()

  constructor() {
    this._nodeApi = window.api as RendererApi

    this._nodeApi.setLogger((data) => this._logs$.next(String(data)))

    this.setConfig = this.setConfig.bind(this)
    this.getConfig = this.getConfig.bind(this)
    this.subscribeOnLogs = this.subscribeOnLogs.bind(this)
  }

  public getMainProcessApi(): RendererApi {
    return this._nodeApi
  }

  public setConfig(config: UserConfigData): Promise<void> {
    return this._nodeApi.setConfig(config)
  }

  public getConfig<T extends ConfigKeys>(key: T): Promise<Required<UserConfigData>[T]> {
    return this._nodeApi.getConfig(key)
  }

  public subscribeOnLogs(subscriber: (data: string | undefined) => void): Subscription {
    return this._logs$.subscribe(subscriber)
  }
}
