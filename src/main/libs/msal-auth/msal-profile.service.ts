import { Injectable } from '@nestjs/common'
import { MicrosoftMinecraftProfile, MojangClient } from '@xmcl/user'

import { IProfileService } from './msal-profile.interface'

@Injectable()
export class MsalProfileService implements IProfileService {
  public async getMojangProfile(accessToken: string): Promise<MicrosoftMinecraftProfile> {
    const client = new MojangClient()
    const userProfile = await client.getProfile(accessToken)
    return userProfile
  }
}
