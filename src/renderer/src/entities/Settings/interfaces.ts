import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

export interface CustomLauncherOptions {
  name: string
  maxRam: string | number
  minRam: string | number
  port?: number
  ip?: string
}

export interface ISettings {
  getSettings: () => Observable<CustomLauncherOptions | null>
  setSettings: (settings: CustomLauncherOptions) => void
}

export namespace ISettings {
  export const $: interfaces.ServiceIdentifier<ISettings> = Symbol('ISettings')
}
