import { javaVersionList } from '../../../../shared/constants'
import { UserConfigData } from '../../../../shared/dtos/config.dto'

export const defaults: UserConfigData = {
  userName: ''
}

export type SettingsTypes = 'string' | 'slider' | 'options' | 'filePath' | 'checkbox'
export interface SettingField {
  fieldName: keyof UserConfigData
  type: SettingsTypes
  isNotShow?: boolean
  options?: (string | number)[]
  label?: string
}

export const settingsList: SettingField[] = [
  {
    fieldName: 'email',
    type: 'string',
    label: 'Email'
  },

  {
    fieldName: 'userName',
    type: 'string',
    label: 'User Name'
  },

  {
    fieldName: 'modpacksPath',
    type: 'filePath',
    label: 'Modpacks Path'
  },
  {
    fieldName: 'javaPath',
    type: 'filePath',
    label: 'Java Path'
  },

  {
    fieldName: 'resolutionFullscreen',
    type: 'checkbox',
    label: 'Full Screen'
  },

  // {
  //   fieldName: 'resolutionHeight',
  //   type: 'string'
  // },
  // {
  //   fieldName: 'resolutionWidth',
  //   type: 'string'
  // },

  {
    fieldName: 'javaArgsVersion',
    type: 'options',
    options: javaVersionList,
    label: 'Java Version'
  },
  {
    fieldName: 'javaArgsMinMemory',
    type: 'slider',
    label: 'Min Java RAM GB'
  },
  {
    fieldName: 'javaArgsMaxMemory',
    type: 'slider',
    label: 'Max Java RAM GB'
  },

  {
    fieldName: 'isLaunchAfterInstall',
    type: 'checkbox',
    label: 'Launch game after installation'
  },
  {
    fieldName: 'isHideAfterLaunch',
    type: 'checkbox',
    label: 'Hide launcher after game launch'
  }
]
