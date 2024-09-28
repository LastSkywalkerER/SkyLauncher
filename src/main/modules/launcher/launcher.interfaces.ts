export interface Version {
  folder: string

  version: string

  forge: string

  java: string
}

export interface CustomLauncherOptions {
  name: string

  maxRam: string | number

  minRam: string | number
}

export interface CreateLauncher {
  version: Version
  customLaucnherOptions: CustomLauncherOptions
}
