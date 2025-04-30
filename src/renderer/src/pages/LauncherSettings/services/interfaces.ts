import { Observable } from 'rxjs'

import type { LauncherInfo } from '../../../../../../shared/dtos/launcher.dto'

export interface ILauncherSettingsService {
  $: symbol
  getLauncherInfo$: Observable<LauncherInfo>
}

export const ILauncherSettingsService = {
  $: Symbol('ILauncherSettingsService')
}
