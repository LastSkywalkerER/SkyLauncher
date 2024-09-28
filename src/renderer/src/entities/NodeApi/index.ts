import { injectable } from 'inversify'

import { INodeApi, Version, WindowApi } from './interfaces'
import { CustomLauncherOptions } from '../Settings/interfaces'
import { from, Observable, ReplaySubject, Subscription } from 'rxjs'

@injectable()
export class NodeApi implements INodeApi {
  private _nodeApi: WindowApi
  private _logs$ = new ReplaySubject<undefined | string>()
  private _versions: Observable<Record<string, Version>>

  constructor() {
    this._nodeApi = window.api as WindowApi

    this._versions = from(this._nodeApi.getMinceraftVersions())

    this._nodeApi.setLogger((data) => this._logs$.next(String(data)))

    this.getMCVersions = this.getMCVersions.bind(this)
    this.launchMinecraft = this.launchMinecraft.bind(this)
    this.subscribeOnLogs = this.subscribeOnLogs.bind(this)
    this.unsubscribeOnLogs = this.unsubscribeOnLogs.bind(this)
  }

  public getMCVersions(): Observable<Record<string, Version>> {
    return this._versions
  }

  public launchMinecraft(version: Version, launcherOptions: CustomLauncherOptions): Promise<void> {
    console.log(version)
    return this._nodeApi.launchMinecraft({
      version,
      customLaucnherOptions: launcherOptions
    })
  }

  public subscribeOnLogs(subscriber: (data: string | undefined) => void): Subscription {
    return this._logs$.subscribe(subscriber)
  }

  public unsubscribeOnLogs(subscription: Subscription): void {
    subscription.unsubscribe()
  }
}
