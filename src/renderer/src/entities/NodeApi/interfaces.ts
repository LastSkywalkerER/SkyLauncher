import { interfaces } from 'inversify'
import { ConfigKeys, UserConfigData } from '../../../../dtos/config.dto'
import { Subscription } from 'rxjs'

export interface INodeApi {
  setConfig(config: UserConfigData): Promise<void>
  getConfig(key: ConfigKeys): Promise<string>

  subscribeOnLogs: (subscriber: (data: string | undefined) => void) => Subscription
}

export namespace INodeApi {
  export const $: interfaces.ServiceIdentifier<INodeApi> = Symbol('INodeApi')
}
