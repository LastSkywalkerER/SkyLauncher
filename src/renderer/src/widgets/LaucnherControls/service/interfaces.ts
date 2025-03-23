import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { IMCGameVersion } from '../../../../../shared/entities/mc-game-version/mc-game-version.interface'

export interface ILauncherControlService {
  launchGame(version: IMCGameVersion): Observable<void>
}

export namespace ILauncherControlService {
  export const $: interfaces.ServiceIdentifier<ILauncherControlService> =
    Symbol('ILauncherControlService')
}
