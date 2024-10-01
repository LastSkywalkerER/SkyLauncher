import { Controller, Inject } from '@nestjs/common'
import { IpcHandle, Window } from '@doubleshot/nest-electron'

import { BrowserWindow } from 'electron'
import { LauncherService } from './launcher.service'
import { CreateLauncher } from './launcher.interfaces'
import { Payload } from '@nestjs/microservices'
import { Client } from '../../utils/launcher/Launcher'

@Controller()
export class LauncherController {
  constructor(
    @Window() private readonly mainWindow: BrowserWindow,
    @Inject(LauncherService) private readonly launcherService: LauncherService
  ) {}

  @IpcHandle('launchMinecraft')
  public async handleLaunchMinecraft(
    @Payload() { version, customLaucnherOptions }: CreateLauncher
  ): Promise<void> {
    const debug = (data: string): void => this.mainWindow.webContents.send('debug', data)
    const options = await this.launcherService.getOptions(version, customLaucnherOptions, debug)

    try {
      const launcher = new Client()
      await launcher.launch(options)
      launcher.onDebug((e: string) => debug(e))
    } catch (error) {
      debug(`Error during launch: ${error}`)
    }
  }
}
