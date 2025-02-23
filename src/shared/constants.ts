export const platform = process.platform
export const arch = process.arch
export const launcherName = 'sky-launcher'
export const tempExtension = '.temp'
export const defaultModpackIcon =
  'https://ipfs.io/ipfs/QmbpHKyw9Fyos1Jhk5CsEFwM2uN14bYJ9W1SRWUktXpQQa'
export const defaultModpackCover =
  'https://ipfs.io/ipfs/QmQMy5KZWkE7BAyEPtRqyjaSkXsHda2ZzCC8kFbyV8V9em'
export const supabaseFunctionsRoute = '/functions/v1'
export const defaultMinecraftPath = '.minecraft'

export enum BucketNames {
  Java = 'java',
  Modpacks = 'modpacks'
}

export enum IPCHandleNames {
  LaunchGame = 'launch-game',
  InstallGame = 'install-game',
  UpdateGame = 'update-game',
  // CheckGame = 'check-game',
  GetLocalMCVersions = 'get-local-mc-versions',
  // GetCustomMCVersions = 'get-custom-mc-versions',
  SetConfig = 'set-config',
  GetConfig = 'get-config',
  Request = 'request'
}

export enum IPCSendNames {
  UserLog = 'user-log',
  ProcessProgress = 'process-progress'
}

export enum ModpackProvider {
  FreshCraft = 'FreshCraft',
  CurseFroge = 'CurseFroge',
  Native = 'Native',
  Forge = 'Forge',
  Local = 'Local'
}

export enum Modloader {
  Forge = 'forge',
  Fabric = 'fabric'
}

export const modloaderList = [Modloader.Forge, Modloader.Fabric]

export const getCurseForgeLinks = ({
  fileID,
  fileName
}: {
  fileID: number
  fileName: string
}): string[] => [
  `https://edge.forgecdn.net/files/${String(fileID).slice(0, 4)}/${String(fileID).slice(4)}/${fileName}`,
  `https://mediafiles.forgecdn.net/files/${String(fileID).slice(0, 4)}/${String(fileID).slice(4)}/${fileName}`
]

export const javaVersionList = {
  darwin: {
    arm64: {
      8: 'https://storage.yandexcloud.net/freshcraft-public/java/darwin/arm64/8.zip',
      11: 'https://storage.yandexcloud.net/freshcraft-public/java/darwin/arm64/11.zip',
      17: '',
      21: ''
    }
  },
  win32: {
    x64: {
      8: '',
      11: '',
      17: '',
      21: ''
    }
  }
}
