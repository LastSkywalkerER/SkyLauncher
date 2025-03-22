import { UserConfigData } from '../../../../shared/dtos/config.dto'

export const defaults: UserConfigData = {
  accessToken: '',
  userId: '',
  minecraftAccessExpiration: '',
  userName: ''
}

export const settingsList: { fieldName: keyof UserConfigData }[] = [
  { fieldName: 'email' },

  { fieldName: 'userName' },
  { fieldName: 'userId' },
  { fieldName: 'accessToken' },

  { fieldName: 'modpacksPath' },
  { fieldName: 'javaPath' },

  { fieldName: 'resolutionFullscreen' },
  { fieldName: 'resolutionHeight' },
  { fieldName: 'resolutionWidth' },

  { fieldName: 'javaArgsVersion' },
  { fieldName: 'javaArgsMaxMemory' },
  { fieldName: 'javaArgsMinMemory' }
]
