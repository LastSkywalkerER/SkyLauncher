import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { IMCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.interface'

export interface IMCLocalGameVersion extends IMCGameVersion {
  isInstalled: boolean
}

export interface IVersions {
  getCustomMCVersions(): Observable<IMCLocalGameVersion[]>
  checkLocalMCVersions(): void
  getLocalMCVersions(): Observable<IMCGameVersion[]>
  getCurrentMCVersion(): Observable<IMCGameVersion | null>
  setCurrentMCVersion(version: IMCGameVersion): void

  installGame(version: IMCGameVersion): Observable<IMCGameVersion>
  updateGame(version: IMCGameVersion): Observable<IMCGameVersion>
}

export namespace IVersions {
  export const $: interfaces.ServiceIdentifier<IVersions> = Symbol('IVersions')
}
