export type UserConfigData = {
  userName?: string
  email?: string

  javaPath?: string
  modpacksPath?: string

  javaArgsMinMemory?: number
  javaArgsMaxMemory?: number
  javaArgsVersion?: number

  resolutionWidth?: number
  resolutionHeight?: number
  resolutionFullscreen?: boolean

  isLaunchAfterInstall?: boolean
  isHideAfterLaunch?: boolean
}

// Получаем все ключи объекта defaults
export type ConfigKeys = keyof UserConfigData
