import { app } from 'electron'
import { join } from 'path'
import { BucketNames, launcherName } from './constants'
import { UserConfigData } from './dtos/config.dto'

export const defaults: UserConfigData = {
  userName: '',
  userId: '',

  javaPath: join(app.getPath('appData'), launcherName, BucketNames.Java),
  modpacksPath: join(app.getPath('appData'), launcherName, BucketNames.Modpacks),

  javaArgsMinMemory: 1024,
  javaArgsMaxMemory: 8126,
  javaArgsVersion: 17,

  resolutionWidth: 900,
  resolutionHeight: 670,
  resolutionFullscreen: false
}
