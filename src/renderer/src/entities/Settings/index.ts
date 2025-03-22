import { inject, injectable } from 'inversify'
import { from, Observable } from 'rxjs'

import { defaults, settingsList } from '../../shared/config/settings.config'
import { NodeApi } from '../NodeApi'
import { INodeApi } from '../NodeApi/interfaces'
import { ISettings, LauncherSettings } from './interfaces'

@injectable()
export class Settings implements ISettings {
  private _nodeApi: NodeApi

  constructor(@inject(INodeApi.$) nodeApi: NodeApi) {
    this._nodeApi = nodeApi

    this.getSettings = this.getSettings.bind(this)
    this.setSettings = this.setSettings.bind(this)
  }

  public getSettings(): Observable<LauncherSettings | null> {
    const getSettingsPromise = async (): Promise<LauncherSettings> => {
      const acc: LauncherSettings = {} as LauncherSettings

      for (const { fieldName } of settingsList) {
        acc[fieldName] = (await this._nodeApi.getConfig(fieldName)) as never
      }

      return acc
    }

    return from(getSettingsPromise())
  }

  // Store new data with mutation of old data
  public setSettings(settings: LauncherSettings): Observable<void> {
    return from(this._nodeApi.setConfig(settings))
  }

  public setDefaults(): Observable<void> {
    return from(this._nodeApi.setConfig(defaults))
  }
}
