export interface Version {
  folder: string
  version: string
  forge: string
  java: string
}

export interface CreateLauncher {
  version: Version
  customLaucnherOptions: CustomLauncherOptions
}

export interface CustomLauncherOptions {
  name: string

  maxRam: string | number

  minRam: string | number
}
