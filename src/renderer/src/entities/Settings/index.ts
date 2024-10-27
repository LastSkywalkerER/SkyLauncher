import { inject, injectable } from 'inversify'
import { BehaviorSubject, Observable } from 'rxjs'

import { settingsList } from '../../shared/config/settings.config'
import { NodeApi } from '../NodeApi'
import { INodeApi } from '../NodeApi/interfaces'
import { ISettings, LauncherSettings } from './interfaces'

@injectable()
export class Settings implements ISettings {
  private _settings = new BehaviorSubject<LauncherSettings | null>(null)
  private _nodeApi: NodeApi

  constructor(@inject(INodeApi.$) nodeApi: NodeApi) {
    this._nodeApi = nodeApi

    const getSettings = async (): Promise<LauncherSettings> => {
      const acc: LauncherSettings = {} as LauncherSettings

      for (const { fieldName } of settingsList) {
        acc[fieldName] = (await this._nodeApi.getConfig(fieldName)) as never
      }

      return acc
    }

    getSettings().then((data) => {
      this._settings.next(data)
    })

    this.getSettings = this.getSettings.bind(this)
    this.setSettings = this.setSettings.bind(this)
  }

  public getSettings(): Observable<LauncherSettings | null> {
    return this._settings
  }

  public async setSettings(settings: LauncherSettings): Promise<void> {
    await this._nodeApi.setConfig(settings)

    this._settings.next(settings)
  }
}
