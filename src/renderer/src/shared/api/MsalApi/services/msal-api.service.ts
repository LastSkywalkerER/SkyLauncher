import { IUser } from '@renderer/entities/User/interfaces'
import { MsalAuthResponse } from '@shared/dtos/msal.dto'
import { MicrosoftMinecraftProfile } from '@xmcl/user'
import { inject, injectable } from 'inversify'
import { from, Observable, switchMap, throwError } from 'rxjs'

import { INodeApi } from '../../NodeApi/interfaces'
import { IMsalApi } from '../interfaces'

@injectable()
export class MsalApi implements IMsalApi {
  constructor(
    @inject(INodeApi.$) private readonly nodeApi: INodeApi,
    @inject(IUser.$) private readonly user: IUser
  ) {
    this.loginWithMicrosoft = this.loginWithMicrosoft.bind(this)
    this.logoutFromMicrosoft = this.logoutFromMicrosoft.bind(this)
    this.getMojangProfile = this.getMojangProfile.bind(this)
  }

  public async loginWithMicrosoft(): Promise<MsalAuthResponse> {
    try {
      const response = await this.nodeApi.getMainProcessApi().loginWithMicrosoft()
      return response as MsalAuthResponse
    } catch (error) {
      console.error('Microsoft login error:', error)
      throw error
    }
  }

  public async logoutFromMicrosoft(): Promise<void> {
    try {
      await this.nodeApi.getMainProcessApi().logoutMicrosoft()
    } catch (error) {
      console.error('Microsoft logout error:', error)
      throw error
    }
  }

  public getMojangProfile(): Observable<MicrosoftMinecraftProfile> {
    return this.user.data$.pipe(
      switchMap((userData) => {
        if (!userData?.accessToken) {
          return throwError(() => new Error('No access token available'))
        }
        return from(this.nodeApi.getMainProcessApi().getMojangProfile(userData.accessToken))
      })
    )
  }
}
