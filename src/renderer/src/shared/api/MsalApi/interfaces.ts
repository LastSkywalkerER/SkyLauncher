import { MsalAuthResponse } from '@shared/dtos/msal.dto'
import { interfaces } from 'inversify'

export interface IMsalApi {
  loginWithMicrosoft(): Promise<MsalAuthResponse>
  logoutFromMicrosoft(): Promise<void>
}

export namespace IMsalApi {
  export const $: interfaces.ServiceIdentifier<IMsalApi> = Symbol('IMsalApi')
}
