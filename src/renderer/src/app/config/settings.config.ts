import { javaVersionList } from '../../../../shared/constants'
import { UserConfigData } from '../../../../shared/dtos/config.dto'
import { environment } from './environments'

export const defaults: UserConfigData = {
  accessToken: '',
  userId: '',
  minecraftAccessExpiration: '',
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
    fieldName: 'userId',
    type: 'string',
    label: 'Iser ID',

    isNotShow: environment.prod
  },
  {
    fieldName: 'accessToken',
    type: 'string',
    label: 'Minecraft Access Token',

    isNotShow: environment.prod
  },

  {
    fieldName: 'modpacksPath',
    type: 'string',
    label: 'Modpacks Path'
  },
  {
    fieldName: 'javaPath',
    type: 'string',
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
  }
]
