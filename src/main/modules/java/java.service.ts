import { existsSync } from 'node:fs'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { exec } from 'child_process'
import { mkdirSync } from 'fs'
import { join } from 'path'

import { removeNestedDirectories } from '../../utils/filesystem/removeNestedDirectories'
import {
  DownloadResponse,
  type IDownloaderService,
  IDownloaderServiceToken
} from '../downloader/downloader.interface'
import { HardwareService } from '../hardware/hardware.service'
import { UnzipService } from '../unzip/unzip.service'
import { UserConfigService } from '../user-config/user-config.service'

@Injectable()
export class JavaService {
  private readonly logger = new Logger(JavaService.name)

  constructor(
    @Inject('BASE_URL') private readonly baseUrl: string,
    @Inject(IDownloaderServiceToken) private readonly downloaderService: IDownloaderService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(UnzipService) private readonly unzipService: UnzipService
  ) {}

  public async isJavaExecutableExists(version?: string): Promise<boolean> {
    const javaExecutablePath = this.hardwareService.getJavaExecutablePath(version)

    if (!existsSync(javaExecutablePath)) {
      this.logger.log(`${javaExecutablePath} not exists`)
      return false
    }
    this.logger.log(`${javaExecutablePath} exists`)

    return true
  }

  public async install(version?: string): Promise<DownloadResponse> {
    const platform = this.hardwareService.getPlatform()
    const architecture = this.hardwareService.getArchitecture()
    const versionName = version || String(this.userConfigService.get('javaArgsVersion'))
    const javaDir = this.userConfigService.get('javaPath')
    const installPath = join(javaDir, platform, architecture, versionName)
    this.logger.log(`Installing java ${versionName}`)

    if (!existsSync(installPath)) {
      mkdirSync(installPath, { recursive: true })
    }

    const downloadResponse = await this.downloaderService.download({
      fileUrl: this.hardwareService.multiplatformJoin(
        this.baseUrl,
        platform,
        architecture,
        `${versionName}.zip`
      ),
      fileName: `${versionName}.zip`,
      outputDirectory: installPath
    })

    const unzipResponse = await this.unzipService.execute({
      inputPath: downloadResponse.filePath,
      outputPath: installPath
    })

    const folder = await removeNestedDirectories(unzipResponse.filePath, versionName)

    this.hardwareService.getPlatform() !== 'win32' &&
      exec(`chmod -R 755 "${javaDir}"`, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Error to chmod java: ${error.message}`)
          return
        }

        if (stderr) {
          this.logger.error(`Error: ${stderr}`)
          return
        }

        this.logger.log(`Chmod sucess: ${stdout}`)
      })

    return { filePath: folder }
  }
}
