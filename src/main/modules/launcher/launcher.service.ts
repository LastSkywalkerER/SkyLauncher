import { Inject, Injectable } from '@nestjs/common'

import { CustomLauncherOptions, LauncherOptions, Version } from './launcher.interfaces'

import { join } from 'path'
import { exec } from 'child_process'
import { DownloaderService } from '../downloader/downloader.service'
import { HardwareService } from '../hardware/hardware.service'
import { UserLoggerService } from '../user-logger/user-logger.service'

@Injectable()
export class LauncherService {
  constructor(
    @Inject(DownloaderService) private readonly downloaderService: DownloaderService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
  ) {}

  public async getOptions(
    version: Version,
    launcherOptions: CustomLauncherOptions
  ): Promise<LauncherOptions> {
    const logger = this.userLoggerService.log.bind(this.userLoggerService)
    const javaDir = await this.downloaderService.downloadJava(version.java, logger)
    const javaExecutable = join(javaDir, this.hardwareService.getJavaExecutableName())

    console.log({ version, launcherOptions })

    this.hardwareService.getPlatform() !== 'win32' &&
      exec(`chmod -R 755 "${javaDir}"`, (error, stdout, stderr) => {
        if (error) {
          logger(`Error to chmod java: ${error.message}`)
          return
        }

        if (stderr) {
          logger(`Error: ${stderr}`)
          return
        }

        logger(`Chmod sucess: ${stdout}`)
      })

    const destinationDir = await this.downloaderService.downloadModpack(version.folder, logger)

    return {
      authorization: {
        uuid: 'offline-uuid',
        name: launcherOptions.name
      },
      root: destinationDir,
      version: {
        number: version.version
      },
      memory: {
        max: launcherOptions.maxRam,
        min: launcherOptions.minRam
      },
      forge: version.forge,
      javaPath: javaExecutable
    }
  }
}
