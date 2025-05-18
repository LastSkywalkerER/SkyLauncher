import {
  AccountInfo,
  AuthenticationResult,
  CacheOptions,
  Configuration,
  InteractionRequiredAuthError,
  PublicClientApplication,
  TokenCache
} from '@azure/msal-node'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { MsalAuthResponse } from '@shared/dtos/msal.dto'
import { shell } from 'electron'

import { IAuthService, IMsalAuthConfig } from './msal-auth.interface'

interface TokenRequest {
  scopes: string[]
  account?: AccountInfo
}

interface MsalConfig {
  auth: {
    clientId: string
    authority: string
    redirectUri: string
  }
  cache: CacheOptions
}

@Injectable()
export class MsalAuthService implements IAuthService {
  private readonly logger = new Logger(MsalAuthService.name)
  private msalConfig: Configuration
  private clientApplication: PublicClientApplication
  private account: AccountInfo | null
  private cache: TokenCache

  constructor(@Inject(IMsalAuthConfig) private readonly config: IMsalAuthConfig) {
    const msalConfig: MsalConfig = {
      auth: {
        clientId: this.config.clientId,
        authority: this.config.authority,
        redirectUri: this.config.redirectUri
      },
      cache: {
        cachePlugin: undefined
      }
    }

    this.msalConfig = msalConfig as Configuration
    this.clientApplication = new PublicClientApplication(this.msalConfig)
    this.cache = this.clientApplication.getTokenCache()
    this.account = null
  }

  async login(): Promise<MsalAuthResponse> {
    const authResponse = await this.getToken({
      scopes: ['XboxLive.signin', 'offline_access', 'openid', 'profile', 'email']
    })

    if (!authResponse) {
      throw new Error('Failed to get authentication response')
    }

    return {
      accessToken: authResponse.accessToken,
      idToken: authResponse.idToken
    }
  }

  async logout(): Promise<void> {
    if (!this.account) return

    try {
      const loginHint = this.account.idTokenClaims?.login_hint
      if (loginHint) {
        await shell.openExternal(
          `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?logout_hint=${encodeURIComponent(loginHint)}`
        )
      }

      await this.cache.removeAccount(this.account)
      this.account = null
    } catch (error) {
      this.logger.error('Logout error:', error)
    }
  }

  async getAccount(): Promise<AccountInfo | null> {
    const currentAccounts = await this.cache.getAllAccounts()

    if (!currentAccounts) {
      this.logger.log('No accounts detected')
      return null
    }

    if (currentAccounts.length > 1) {
      this.logger.log('Multiple accounts detected, using first account')
      return currentAccounts[0]
    } else if (currentAccounts.length === 1) {
      return currentAccounts[0]
    } else {
      return null
    }
  }

  private async getToken(tokenRequest: TokenRequest): Promise<AuthenticationResult | null> {
    let authResponse: AuthenticationResult | null = null
    const account = this.account || (await this.getAccount())

    if (account) {
      tokenRequest.account = account
      authResponse = await this.getTokenSilent(tokenRequest)
    } else {
      authResponse = await this.getTokenInteractive(tokenRequest)
    }

    return authResponse
  }

  private async getTokenSilent(tokenRequest: TokenRequest): Promise<AuthenticationResult | null> {
    try {
      if (!tokenRequest.account) {
        throw new Error('Account is required for silent token acquisition')
      }
      return await this.clientApplication.acquireTokenSilent({
        account: tokenRequest.account,
        scopes: tokenRequest.scopes
      })
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        this.logger.log('Silent token acquisition failed, acquiring token interactive')
        return await this.getTokenInteractive(tokenRequest)
      }

      this.logger.error('Token silent error:', error)
      return null
    }
  }

  private async getTokenInteractive(
    tokenRequest: TokenRequest
  ): Promise<AuthenticationResult | null> {
    try {
      const openBrowser = async (url: string): Promise<void> => {
        await shell.openExternal(url)
      }

      const authResponse = await this.clientApplication.acquireTokenInteractive({
        scopes: tokenRequest.scopes,
        openBrowser,
        successTemplate:
          '<h1>Successfully signed in!</h1> <p>You can close this window now and navigate back to the application.</p>',
        errorTemplate:
          '<h1>Oops! Something went wrong</h1> <p>Navigate back to the application and check the console for more information.</p>'
      })

      return authResponse
    } catch (error) {
      this.logger.error('Token interactive error:', error)
      throw error
    }
  }
}
