import { interfaces } from 'inversify'
import { Observable } from 'rxjs'
import { UserConfigData } from '../../../../dtos/config.dto'

export interface LauncherSettings extends UserConfigData {}

export interface ISettings {
  getSettings: () => Observable<LauncherSettings | null>
  setSettings: (settings: LauncherSettings) => void
}

export namespace ISettings {
  export const $: interfaces.ServiceIdentifier<ISettings> = Symbol('ISettings')
}
