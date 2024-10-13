import { app } from 'electron'
import { join } from 'path'
import { BucketNames, launcherName } from './constants'
import { UserConfigData } from './dtos/config.dto'

export const defaults: UserConfigData = {
  user: {
    name: '',
    id: ''
  },
  directoriesPaths: {
    java: join(app.getPath('appData'), launcherName, BucketNames.Java),
    modpacks: join(app.getPath('appData'), launcherName, BucketNames.Modpacks)
  },
  javaArgs: {
    minMemory: 1024,
    maxMemory: 8126,
    version: 17
  },
  resolution: {
    width: 900,
    height: 670,
    fullscreen: false
  }
}
