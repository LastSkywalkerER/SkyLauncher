import { LauncherSettings } from '@renderer/entities/Settings/interfaces'
import { Observable } from 'rxjs'
import { LauncherInfo } from 'src/shared/dtos/launcher.dto'

export interface ILauncherSettingsService {
  $: symbol
  getLauncherInfo$: Observable<LauncherInfo>
  getSettings: () => Observable<LauncherSettings | null>
  setSettings: (settings: Partial<LauncherSettings>) => Observable<void>
}

export const ILauncherSettingsService = {
  $: Symbol('ILauncherSettingsService')
}
