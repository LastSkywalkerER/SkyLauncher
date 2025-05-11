export const platform = process.platform
export const arch = process.arch
export const launcherName = 'skylauncher' // Same as package.json name
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
  RemoveFolder = 'remove-folder',
  OpenFolder = 'open-folder',
  // CheckGame = 'check-game',
  GetLocalMCVersions = 'get-local-mc-versions',
  // GetCustomMCVersions = 'get-custom-mc-versions',
  SetConfig = 'set-config',
  GetConfig = 'get-config',
  Request = 'request',
  GetLauncherInfo = 'GetLauncherInfo',
  UpdateLocalMCVersion = 'update-local-mc-version'
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

export const javaVersionList = [8, 11, 17, 21]

export const defaultJavaArgs =
  '-Xmx5G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M'
export const defaultMaxMemory = 5120
