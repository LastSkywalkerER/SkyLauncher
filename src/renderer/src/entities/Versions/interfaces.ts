import { interfaces } from 'inversify'
import { Observable } from 'rxjs'
import { IMCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.interface'

export interface IVersions {
  getCustomMCVersions(): Observable<IMCGameVersion[]>
  getLocalMCVersions(): Observable<IMCGameVersion[]>
  getCurrentMCVersion(): Observable<IMCGameVersion>
  setCurrentMCVersion(version: IMCGameVersion): void
  launchGame(version: IMCGameVersion): void
  checkGame(version: IMCGameVersion): void
  installGame(version: IMCGameVersion): void
}

export namespace IVersions {
  export const $: interfaces.ServiceIdentifier<IVersions> = Symbol('IVersions')
}
