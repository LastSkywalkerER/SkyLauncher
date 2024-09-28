import { interfaces } from 'inversify'

export interface CustomLauncherOptions {
  name: string
  maxRam: number | string
  minRam: number | string
}

export interface ISettings {
  getSettings: () => CustomLauncherOptions
  setSettings: (settings: CustomLauncherOptions) => void
}

export namespace ISettings {
  export const $: interfaces.ServiceIdentifier<ISettings> = Symbol('ISettings')
}
