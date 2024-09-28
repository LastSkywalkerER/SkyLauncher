import { interfaces } from 'inversify'
import { CustomLauncherOptions } from '../Settings/interfaces'
import { Observable, Subscription } from 'rxjs'
import { IpcRenderer } from 'electron'

export interface Version {
  folder: string
  version: string
  forge: string
  java: string
}

export interface INodeApi {
  getMCVersions: () => Observable<Record<string, Version>>
  launchMinecraft: (version: Version, launcherOptions: CustomLauncherOptions) => Promise<void>

  subscribeOnLogs: (subscriber: (data: string | undefined) => void) => Subscription
  unsubscribeOnLogs: (subscription: Subscription) => void
}

export interface LaunchOptions {
  version: Version
  customLaucnherOptions: CustomLauncherOptions
}

export interface WindowApi {
  getMinceraftVersions: () => Promise<Record<string, Version>>
  launchMinecraft: (data: LaunchOptions) => Promise<void>
  setLogger: (logTracer: (...data: unknown[]) => void) => IpcRenderer
}

export namespace INodeApi {
  export const $: interfaces.ServiceIdentifier<INodeApi> = Symbol('INodeApi')
}
