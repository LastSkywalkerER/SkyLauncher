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
