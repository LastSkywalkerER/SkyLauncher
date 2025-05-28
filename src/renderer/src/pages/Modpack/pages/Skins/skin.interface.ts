import { ILoadableState } from '@renderer/entities/LoadableState/interfaces'
import { MicrosoftMinecraftProfile } from '@xmcl/user'
import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

export interface ISkinService extends ILoadableState<MicrosoftMinecraftProfile> {
  getMojangProfile(): Observable<MicrosoftMinecraftProfile>
  setSkin(
    source: string,
    variant: 'slim' | 'classic',
    token?: string
  ): Observable<MicrosoftMinecraftProfile>
}

export namespace ISkinService {
  export const $: interfaces.ServiceIdentifier<ISkinService> = Symbol('ISkinService')
}
