import { Controller } from '@nestjs/common'
import { IpcHandle, Window } from '@doubleshot/nest-electron'
import { CreateLauncher, Version } from './modules/launcher/launcher.interfaces'
import { versions } from './utils/launcher/versions'
import { Payload } from '@nestjs/microservices'
import { BrowserWindow } from 'electron'

import { Client } from './utils/launcher/Launcher'
import { getOptions } from './utils/launcher/getOptions'
import { LauncherService } from './modules/launcher/launcher.service'

@Controller()
export class AppController {
  constructor(
    @Window() private readonly mainWindow: BrowserWindow,
    // TODO: make dependancy ingection work
    private readonly laucnherService: LauncherService
  ) {
    console.log('laucnherService: ', laucnherService)
  }

  @IpcHandle('getMinceraftVersions')
  public handleGetMinceraftVersions(): Record<string, Version> {
    return versions
  }

  @IpcHandle('launchMinecraft')
  public async handleLaunchMinecraft(
    @Payload() { version, customLaucnherOptions }: CreateLauncher
  ): Promise<void> {
    const debug = (data: string): void => this.mainWindow.webContents.send('debug', data)
    const options = await getOptions(version, customLaucnherOptions, debug)

    try {
      const launcher = new Client()
      await launcher.launch(options)
      launcher.onDebug((e: string) => debug(e))
    } catch (error) {
      debug(`Error during launch: ${error}`)
    }
  }
}
