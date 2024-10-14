import { inject, injectable } from 'inversify'

import { CustomLauncherOptions, ISettings } from './interfaces'
import { environment } from '../../shared/config/environments'
import { NodeApi } from '../NodeApi'
import { INodeApi } from '../NodeApi/interfaces'
import { BehaviorSubject, Observable } from 'rxjs'

@injectable()
export class Settings implements ISettings {
  private _settings = new BehaviorSubject<CustomLauncherOptions | null>(null)
  private _nodeApi: NodeApi

  constructor(@inject(INodeApi.$) nodeApi: NodeApi) {
    this._nodeApi = nodeApi

    const getSettings = async (): Promise<CustomLauncherOptions> => {
      return {
        port: environment.serverPort!,
        ip: environment.serverIp!,
        maxRam: await this._nodeApi.getConfig('javaArgsMaxMemory'),
        minRam: await this._nodeApi.getConfig('javaArgsMinMemory'),
        name: await this._nodeApi.getConfig('userName')
      }
    }

    getSettings().then((data) => {
      this._settings.next(data)
    })

    this.getSettings = this.getSettings.bind(this)
    this.setSettings = this.setSettings.bind(this)
  }

  public getSettings(): Observable<CustomLauncherOptions | null> {
    return this._settings
  }

  public async setSettings(settings: CustomLauncherOptions): Promise<void> {
    await this._nodeApi.setConfig({
      userName: settings.name,
      javaArgsMaxMemory: Number(settings.maxRam),
      javaArgsMinMemory: Number(settings.minRam)
    })

    this._settings.next(settings)
  }
}
