export const platform = process.platform
export const arch = process.arch
export const launcherName = 'sky-launcher'
export const versionsFolder = 'versions'
export const forgeVersionSeparator = '-forge-'
export const defaultModpackIcon =
  'https://ipfs.io/ipfs/QmbpHKyw9Fyos1Jhk5CsEFwM2uN14bYJ9W1SRWUktXpQQa'
export const defaultModpackCover =
  'https://ipfs.io/ipfs/QmQMy5KZWkE7BAyEPtRqyjaSkXsHda2ZzCC8kFbyV8V9em'
export const websiteLink = 'https://freshcraft.org/'
export const termsLink = 'https://freshcraft.org/'
export const xboxConnectionLink = 'https://freshcraft.org/'

export enum BucketNames {
  Java = 'java',
  Modpacks = 'modpacks'
}

export enum IPCHandleNames {
  LaunchGame = 'launch-game',
  InstallGame = 'install-game',
  UpdateGame = 'update-game',
  CheckGame = 'check-game',
  GetLocalMCVersions = 'get-local-mc-versions',
  GetCustomMCVersions = 'get-custom-mc-versions',
  SetConfig = 'set-config',
  GetConfig = 'get-config',
  Request = 'request'
}

export enum IPCSendNames {
  UserLog = 'user-log',
  ProcessProgress = 'process-progress'
}
