import { Controller, Inject } from '@nestjs/common'
import { IpcHandle } from '@doubleshot/nest-electron'
import { LauncherService } from './launcher.service'
import { type CreateLauncher } from './launcher.interfaces'
import { Payload } from '@nestjs/microservices'
import { Client } from '../../utils/launcher/Launcher'
import { IPCHandleNames } from '../../constants'
import { UserLoggerService } from '../user-logger/user-logger.service'

@Controller()
export class LauncherController {
  constructor(
    @Inject(LauncherService) private readonly launcherService: LauncherService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
  ) {}

  @IpcHandle(IPCHandleNames.LaunchMinecraft)
  public async handleLaunchMinecraft(
    @Payload() { version, customLauncherOptions }: CreateLauncher
  ): Promise<void> {
    const options = await this.launcherService.getOptions(version, customLauncherOptions)

    try {
      const launcher = new Client()
      await launcher.launch(
        options,
        customLauncherOptions.ip && customLauncherOptions.port
          ? {
              server: { port: customLauncherOptions.port, ip: customLauncherOptions.ip }
            }
          : undefined
      )
      launcher.onDebug((e: string) => this.userLoggerService.log(e))
    } catch (error) {
      this.userLoggerService.log(`Error during launch: ${error}`)
    }
  }
}
