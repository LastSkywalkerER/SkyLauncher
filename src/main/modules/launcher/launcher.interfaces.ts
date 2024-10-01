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

export interface LauncherOptions {
  authorization: {
    uuid: string
    name: string
  }
  root: string

  version: {
    number: string
  }
  memory: {
    max: number | string
    min: number | string
  }
  forge?: string
  javaPath: string
  window?: {
    fullscreen?: true
    height?: number
    width?: number
  }
}
