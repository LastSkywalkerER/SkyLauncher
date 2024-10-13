export const platform = process.platform
export const arch = process.arch
export const launcherName = 'SkyLauncher'
export const versionsFolder = 'versions'
export const forgeVersionSeparator = '-forge-'
export const defaultModpackIcon =
  'https://ipfs.io/ipfs/QmTjtPMc2gXGxdyFrsnzAvVa7gLBNBguasNVqJNa1X5ZzT'

export enum BucketNames {
  Java = 'java',
  Modpacks = 'modpacks'
}

export enum IPCHandleNames {
  LaunchGame = 'launch-game',
  InstallGame = 'install-game',
  CheckGame = 'check-game',
  GetLocalMCVersions = 'get-local-mc-versions',
  GetCustomMCVersions = 'get-custom-mc-versions',
  SetConfig = 'set-config',
  GetConfig = 'get-config'
}

export enum IPCSendNames {
  UserLog = 'user-log',
  ProcessProgress = 'process-progress'
}
