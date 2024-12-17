export interface ManifestCurseForge {
  minecraft: {
    version: string
    modLoaders: {
      id: string
      primary: boolean
    }[]
  }
  manifestType: 'minecraftModpack'
  manifestVersion: number
  name: string
  version: string
  author: string
  files: {
    projectID: number
    fileID: number
    required: boolean
  }[]
  overrides: string
}
