import { AccountInfo } from '@azure/msal-node'

export interface IMsalAuthConfig {
  clientId: string
  authority: string
  redirectUri: string
}

export interface IAuthService {
  login(): Promise<{ accessToken: string; idToken: string }>
  logout(): Promise<void>
  getAccount(): Promise<AccountInfo | null>
}

export const IAuthService = Symbol('IAuthService')
export const IMsalAuthConfig = Symbol('IMsalAuthConfig')
