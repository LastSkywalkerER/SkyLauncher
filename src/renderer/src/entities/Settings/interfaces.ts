import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { UserConfigData } from '../../../../shared/dtos/config.dto'

export interface LauncherSettings extends UserConfigData {}

export interface ISettings {
  getSettings: () => Observable<LauncherSettings | null>
  setSettings: (settings: LauncherSettings) => Observable<void>
  setDefaults: () => Observable<void>
}

export namespace ISettings {
  export const $: interfaces.ServiceIdentifier<ISettings> = Symbol('ISettings')
}
