import { app } from 'electron'
import { join } from 'path'

export const getAppDir = async (): Promise<string> =>
  join(await app.getPath('appData'), 'SkyLauncher')
