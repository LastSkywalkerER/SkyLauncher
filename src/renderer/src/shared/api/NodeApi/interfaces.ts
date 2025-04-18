import { interfaces } from 'inversify'
import { Subscription } from 'rxjs'

import { RendererApi } from '../../../../../shared/api/types'
import { ConfigKeys, UserConfigData } from '../../../../../shared/dtos/config.dto'

export interface INodeApi {
  getMainProcessApi(): RendererApi

  setConfig(config: UserConfigData): Promise<void>
  getConfig<T extends ConfigKeys>(key: T): Promise<Required<UserConfigData>[T]>

  subscribeOnLogs: (subscriber: (data: string | undefined) => void) => Subscription
}

export namespace INodeApi {
  export const $: interfaces.ServiceIdentifier<INodeApi> = Symbol('INodeApi')
}
