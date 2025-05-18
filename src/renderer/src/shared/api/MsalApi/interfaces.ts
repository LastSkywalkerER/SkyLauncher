import { MsalAuthResponse } from '@shared/dtos/msal.dto'
import { MicrosoftMinecraftProfile } from '@xmcl/user'
import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

export interface IMsalApi {
  loginWithMicrosoft(): Promise<MsalAuthResponse>
  logoutFromMicrosoft(): Promise<void>
  getMojangProfile(): Observable<MicrosoftMinecraftProfile>
}

export namespace IMsalApi {
  export const $: interfaces.ServiceIdentifier<IMsalApi> = Symbol('IMsalApi')
}
