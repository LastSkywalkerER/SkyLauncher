import { UserConfigData } from '../../../../dtos/config.dto'

export const settingsList: { fieldName: keyof UserConfigData }[] = [
  { fieldName: 'userId' },
  { fieldName: 'userName' },

  { fieldName: 'modpacksPath' },
  { fieldName: 'javaPath' },

  { fieldName: 'resolutionFullscreen' },
  { fieldName: 'resolutionHeight' },
  { fieldName: 'resolutionWidth' },

  { fieldName: 'javaArgsVersion' },
  { fieldName: 'javaArgsMaxMemory' },
  { fieldName: 'javaArgsMinMemory' }
]
