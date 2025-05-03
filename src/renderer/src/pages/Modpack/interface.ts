export interface ModpackSettings {
  folder: string
  width: number
  height: number
  fullscreen: boolean
  // javaPath: string
  javaVersion: string
  javaArgs: string
  javaArgsMinMemory: number
  javaArgsMaxMemory: number
}

export interface SettingsFormProps {
  defaultValues: ModpackSettings
  onSubmit: (data: ModpackSettings) => void
  onCancel: () => void
}
