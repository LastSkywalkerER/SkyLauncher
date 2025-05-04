import { Observable } from 'rxjs'
import { LauncherInfo } from 'src/shared/dtos/launcher.dto'

export interface ILauncherSettingsService {
  $: symbol
  getLauncherInfo$: Observable<LauncherInfo>
}

export const ILauncherSettingsService = {
  $: Symbol('ILauncherSettingsService')
}
