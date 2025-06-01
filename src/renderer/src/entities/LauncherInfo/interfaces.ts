import { LauncherInfo } from '@shared/dtos/launcher.dto'
import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { ILoadableState } from '../LoadableState/interfaces'

export interface ILauncherInfo extends ILoadableState<LauncherInfo> {
  getLauncherInfo: () => LauncherInfo
  refreshLauncherInfo: () => Observable<LauncherInfo>
}

export namespace ILauncherInfo {
  export const $: interfaces.ServiceIdentifier<ILauncherInfo> = Symbol('ILauncherInfo')
}
