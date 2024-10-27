import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { IMCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.interface'

export interface IVersions {
  getCustomMCVersions(): Observable<IMCGameVersion[]>
  checkLocalMCVersions(): void
  getLocalMCVersions(): Observable<IMCGameVersion[]>
  getCurrentMCVersion(): Observable<IMCGameVersion | null>
  setCurrentMCVersion(version: IMCGameVersion): void
  launchGame(version: IMCGameVersion): void
  checkGame(version: IMCGameVersion): void
  installGame(version: IMCGameVersion): Observable<IMCGameVersion>
}

export namespace IVersions {
  export const $: interfaces.ServiceIdentifier<IVersions> = Symbol('IVersions')
}
