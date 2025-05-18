import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject, Logger } from '@nestjs/common'
import { IPCHandleNames } from '@shared/constants'
import { MicrosoftMinecraftProfile } from '@xmcl/user'

import { IAuthService } from './msal-auth.interface'
import { MsalProfileService } from './msal-profile.service'

@Controller()
export class MsalAuthController {
  private readonly logger = new Logger(MsalAuthController.name)

  constructor(
    @Inject(IAuthService) private readonly authService: IAuthService,
    @Inject(MsalProfileService) private readonly profileService: MsalProfileService
  ) {}

  @IpcHandle(IPCHandleNames.LoginWithMicrosoft)
  async handleLogin(): Promise<{ accessToken: string; idToken: string }> {
    try {
      const account = await this.authService.login()
      return {
        accessToken: account.accessToken,
        idToken: account.idToken
      }
    } catch (error) {
      this.logger.error('Microsoft login error:', error)
      throw error
    }
  }

  @IpcHandle(IPCHandleNames.LogoutMicrosoft)
  async handleLogout(): Promise<boolean> {
    try {
      await this.authService.logout()
      return true
    } catch (error) {
      this.logger.error('Microsoft logout error:', error)
      throw error
    }
  }

  @IpcHandle(IPCHandleNames.GetMojangProfile)
  async handleGetMojangProfile(accessToken: string): Promise<MicrosoftMinecraftProfile> {
    try {
      return await this.profileService.getMojangProfile(accessToken)
    } catch (error) {
      this.logger.error('Get Mojang profile error:', error)
      throw error
    }
  }
}
