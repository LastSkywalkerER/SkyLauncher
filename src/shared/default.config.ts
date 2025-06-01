import { app } from 'electron'
import { join } from 'path'

import { BucketNames, defaultMaxMemory, launcherName } from './constants'
import { UserConfigData } from './dtos/config.dto'

// TODO: remove non launcher configs and prepare diffrenet configs for user data
export const defaults: UserConfigData = {
  userName: '',

  javaPath: join(app.getPath('appData'), launcherName, BucketNames.Java),
  modpacksPath: join(app.getPath('appData'), launcherName, BucketNames.Modpacks),

  javaArgsMinMemory: 1024,
  javaArgsMaxMemory: defaultMaxMemory,
  javaArgsVersion: 17,

  resolutionWidth: 1280,
  resolutionHeight: 720,
  resolutionFullscreen: false,

  isLaunchAfterInstall: true,
  isHideAfterLaunch: true
}
