import { UserConfigData } from '../../../../shared/dtos/config.dto'

export const settingsList: { fieldName: keyof UserConfigData }[] = [
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
