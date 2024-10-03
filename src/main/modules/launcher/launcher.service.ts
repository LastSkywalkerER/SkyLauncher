import { Inject, Injectable } from '@nestjs/common'

import { CustomLauncherOptions, LauncherOptions, Version } from './launcher.interfaces'

import { join } from 'path'
import { exec } from 'child_process'
import { DownloaderService } from '../downloader/downloader.service'

@Injectable()
export class LauncherService {
  constructor(@Inject(DownloaderService) private readonly downloaderService: DownloaderService) {}

  public async getOptions(
    version: Version,
    launcherOptions: CustomLauncherOptions,
    logger: (data: string) => void
  ): Promise<LauncherOptions> {
    const javaDir = await this.downloaderService.downloadJava(version.java, logger)
    const javaExecutable = join(
      javaDir,
      process.platform === 'win32' ? '/bin/java.exe' : '/bin/java'
    )

    process.platform !== 'win32' &&
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

    // if (existsSync(destinationDir)) {
    //   logger('Game folder exists')
    // } else {
    //   logger('Generating game folder...')

    //   try {
    //     cpSync(sourceDir, destinationDir, { recursive: true })
    //     logger('Game folder genereated')
    //   } catch (error) {
    //     logger(String(error))
    //   }
    // }

    return {
      authorization: {
        uuid: 'offline-uuid',
        name: launcherOptions.name
      },
      root: destinationDir,
      // root: join(minecraftDir.replace('/index.jar', ''), 'Grape Industrial DLC'),
      version: {
        number: version.version
      },
      memory: {
        max: launcherOptions.maxRam,
        min: launcherOptions.minRam
      },
      forge: version.forge,
      javaPath: javaExecutable
      // javaPath: java
    }
  }
}
