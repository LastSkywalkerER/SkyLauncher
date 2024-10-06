import { interfaces } from 'inversify'
import { CustomLauncherOptions } from '../Settings/interfaces'
import { Observable, Subscription } from 'rxjs'
import { IpcRenderer } from 'electron'
import { defaults } from '../Settings/user-config.schema'
import { FieldPath } from 'react-hook-form'

export interface Version {
  folder: string
  version: string
  forge: string
  java: string
  icon: string
}

export interface INodeApi {
  getMCVersions: () => Observable<Record<string, Version>>
  launchMinecraft: (version: Version, launcherOptions: CustomLauncherOptions) => Promise<void>

  subscribeOnLogs: (subscriber: (data: string | undefined) => void) => Subscription
  unsubscribeOnLogs: (subscription: Subscription) => void
}

export interface LaunchOptions {
  version: Version
  customLauncherOptions: CustomLauncherOptions
}

export type ConfigKeys = FieldPath<typeof defaults>

export interface SetConfig {
  key: ConfigKeys
  value: unknown
}

export interface GetConfig {
  key: ConfigKeys
}

export interface WindowApi {
  getMinecraftVersions: () => Promise<Record<string, Version>>
  launchMinecraft: (data: LaunchOptions) => Promise<void>
  setLogger: (logTracer: (...data: unknown[]) => void) => IpcRenderer
  setUserConfig: (data: SetConfig) => Promise<void>
  getUserConfig: (data: GetConfig) => Promise<string>
}

export namespace INodeApi {
  export const $: interfaces.ServiceIdentifier<INodeApi> = Symbol('INodeApi')
}
