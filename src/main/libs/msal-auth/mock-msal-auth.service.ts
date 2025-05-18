import { AccountInfo } from '@azure/msal-node'
import { Injectable, Logger } from '@nestjs/common'
import { MicrosoftMinecraftProfile } from '@xmcl/user'

import { IAuthService } from './msal-auth.interface'

@Injectable()
export class MockMsalAuthService implements IAuthService {
  private readonly logger = new Logger(MockMsalAuthService.name)

  async login(): Promise<{ accessToken: string; idToken: string }> {
    this.logger.warn('Using mock auth service - login not implemented')
    throw new Error('Auth service not configured')
  }

  async logout(): Promise<void> {
    this.logger.warn('Using mock auth service - logout not implemented')
  }

  async getAccount(): Promise<AccountInfo | null> {
    this.logger.warn('Using mock auth service - getAccount not implemented')
    return null
  }

  async getMojangProfile(): Promise<MicrosoftMinecraftProfile> {
    this.logger.warn('Using mock auth service - getMojangProfile not implemented')
    throw new Error('Auth service not configured')
  }
}
