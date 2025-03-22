export type UserConfigData = {
  email?: string

  userName?: string
  userId?: string
  accessToken?: string
  minecraftAccessExpiration?: string

  javaPath?: string
  modpacksPath?: string

  javaArgsMinMemory?: number
  javaArgsMaxMemory?: number
  javaArgsVersion?: number

  resolutionWidth?: number
  resolutionHeight?: number
  resolutionFullscreen?: boolean
}

// Получаем все ключи объекта defaults
export type ConfigKeys = keyof UserConfigData
