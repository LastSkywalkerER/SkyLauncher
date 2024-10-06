export const platform = process.platform
export const arch = process.arch
export const launcherName = 'SkyLauncher'

export enum BucketNames {
  Java = 'java',
  Modpacks = 'modpacks'
}

export enum IPCHandleNames {
  LaunchMinecraft = 'launchMinecraft',
  GetMinecraftVersions = 'getMinecraftVersions',
  SetConfig = 'set-config',
  GetConfig = 'get-config'
}

export enum IPCSendNames {
  UserLog = 'user-log'
}
