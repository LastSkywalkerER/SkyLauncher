import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MockMsalAuthService } from './mock-msal-auth.service'
import { MsalAuthController } from './msal-auth.controller'
import { IAuthService } from './msal-auth.interface'
import { MsalAuthService } from './msal-auth.service'
import { MsalProfileService } from './msal-profile.service'

@Global()
@Module({
  controllers: [MsalAuthController],
  providers: [
    {
      provide: IAuthService,
      useFactory: (configService: ConfigService): MsalAuthService | MockMsalAuthService => {
        const clientId = configService.get<string>('auth.clientId')
        const authority = configService.get<string>('auth.authority')
        const redirectUri = configService.get<string>('auth.redirectUri')

        if (!clientId || !authority || !redirectUri) {
          return new MockMsalAuthService()
        }

        return new MsalAuthService({
          clientId,
          authority,
          redirectUri
        })
      },
      inject: [ConfigService]
    },
    MsalProfileService
  ],
  exports: [IAuthService, MsalProfileService]
})
export class MsalAuthModule {}
