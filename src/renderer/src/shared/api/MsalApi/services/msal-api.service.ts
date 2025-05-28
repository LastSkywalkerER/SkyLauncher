import { MsalAuthResponse } from '@shared/dtos/msal.dto'
import { inject, injectable } from 'inversify'

import { INodeApi } from '../../NodeApi/interfaces'
import { IMsalApi } from '../interfaces'

@injectable()
export class MsalApi implements IMsalApi {
  constructor(@inject(INodeApi.$) private readonly nodeApi: INodeApi) {
    this.loginWithMicrosoft = this.loginWithMicrosoft.bind(this)
    this.logoutFromMicrosoft = this.logoutFromMicrosoft.bind(this)
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
}
