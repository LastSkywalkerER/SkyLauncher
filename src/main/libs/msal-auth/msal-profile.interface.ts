import { MicrosoftMinecraftProfile } from '@xmcl/user'

export interface IProfileService {
  getMojangProfile(accessToken: string): Promise<MicrosoftMinecraftProfile>
}
