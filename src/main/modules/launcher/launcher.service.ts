import { ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'

import { Inject, Injectable } from '@nestjs/common'
import { launch, LaunchOption, Version } from '@xmcl/core'
import { install, installForge, installLibraries } from '@xmcl/installer'
import { exec } from 'child_process'
import { promises as fsPromises } from 'fs'
import { join } from 'path'

import {
  imageFields,
  MCGameVersion
} from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { DownloaderService } from '../downloader/downloader.service'
import { HardwareService } from '../hardware/hardware.service'
import { UserConfigService } from '../user-config/user-config.service'
import { UserLoggerService } from '../user-logger/user-logger.service'
import { VersionsService } from '../versions/versions.service'

@Injectable()
export class LauncherService {
  constructor(
    @Inject(DownloaderService) private readonly downloaderService: DownloaderService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(VersionsService) private readonly versionsService: VersionsService
  ) {}

  public async isJavaExecutableExists(version?: string): Promise<boolean> {
    const javaDir = this.hardwareService.getJavaDir(version)
    const javaExecutablePath = this.hardwareService.getJavaExecutablePath(version)

    if (!existsSync(javaDir)) {
      this.userLoggerService.log(`${javaDir} not exists`)
      return false
    }
    this.userLoggerService.log(`${javaDir} exists`)

    if (!existsSync(javaExecutablePath)) {
      this.userLoggerService.log(`${javaExecutablePath} not exists`)
      return false
    }
    this.userLoggerService.log(`${javaExecutablePath} exists`)

    return true
  }

  public async installJava(version?: string): Promise<void> {
    const javaDir = await this.downloaderService.downloadJava(version)

    this.hardwareService.getPlatform() !== 'win32' &&
      exec(`chmod -R 755 "${javaDir}"`, (error, stdout, stderr) => {
        if (error) {
          this.userLoggerService.error(`Error to chmod java: ${error.message}`)
          return
        }

        if (stderr) {
          this.userLoggerService.error(`Error: ${stderr}`)
          return
        }

        this.userLoggerService.log(`Chmod sucess: ${stdout}`)
      })
  }

  public async installNativeGame(version: MCGameVersion): Promise<MCGameVersion> {
    const updatedVersion = version.update({
      folder: version.folder || join(this.userConfigService.get('modpacksPath'), version.name)
    }) as MCGameVersion

    let jsonUrl = updatedVersion.jsonUrl

    if (!jsonUrl) {
      const nativeVersion = await this.versionsService.getNativeVersions([version.version])

      jsonUrl = nativeVersion[0].jsonUrl
    }

    try {
      await install(
        {
          url: jsonUrl!,
          id: version.version
        },
        updatedVersion.folder!
      )

      const resolvedVersion = await Version.parse(updatedVersion.folder!, version.version)

      await installLibraries(resolvedVersion)

      return updatedVersion.update({ jsonUrl }).updateStatus({ native: true, libs: true })
    } catch (error) {
      this.userLoggerService.error(`Error while installing native game: `, error)
      return version
    }
  }

  public async installForgeGame(version: MCGameVersion): Promise<MCGameVersion> {
    const updatedVersion = version.update({
      folder: version.folder || join(this.userConfigService.get('modpacksPath'), version.name)
    })

    if (!(await this.isJavaExecutableExists(version.java))) {
      await this.installJava(version.java)
    }

    const javaPath = this.hardwareService.getJavaExecutablePath(version.java)

    try {
      const nativeVersion = await this.installNativeGame(updatedVersion)

      if (!nativeVersion.forge) {
        throw Error('There is no forge version')
      }

      await installForge(
        { mcversion: nativeVersion.version, version: nativeVersion.forge },
        nativeVersion.folder!,
        { java: javaPath }
      )

      return nativeVersion.updateStatus({ forge: true })
    } catch (error) {
      this.userLoggerService.error(`Error while installing forged game: `, error)
      return version
    }
  }

  public async installCustomModpack(version: MCGameVersion): Promise<MCGameVersion> {
    try {
      const modpackDir = await this.downloaderService.downloadModpack(version)

      const updatedVersion = version.update({ folder: modpackDir })

      const newMetadata = updatedVersion.getData()
      imageFields.forEach((field) => delete newMetadata[field])
      await updatedVersion.updateMetadata(newMetadata)

      await Promise.all(
        imageFields.map(async (field) => {
          if (updatedVersion[field]) {
            const imagePath = await this.downloaderService.downloadImage({
              fileUrl: updatedVersion[field] as string,
              fileName: `${field}.png`,
              outputDirectory: join(modpackDir, updatedVersion.metadataDirName)
            })

            const file = await fsPromises.readFile(imagePath, 'base64')

            await updatedVersion.updateMetadata({ [field]: imagePath })
            updatedVersion.update({ [field]: `data:image/png;base64,${file}` })
          }
        })
      )

      return await this.installForgeGame(updatedVersion)
    } catch (error) {
      this.userLoggerService.error(`Error while installing custom modpack: `, error)
      return version
    }
  }

  public async updateCustomModpack(version: MCGameVersion): Promise<MCGameVersion> {
    if (!version.folder) {
      return this.installCustomModpack(version)
    }

    try {
      const exists = await fsPromises.stat(version.folder).catch(() => false)

      if (exists) {
        await fsPromises.rm(version.folder, { recursive: true, force: true })
        this.userLoggerService.info(`Directory "${version.folder}" deleted successfully.`)
      } else {
        this.userLoggerService.info(`Directory "${version.folder}" does not exist.`)
      }

      return this.installCustomModpack(version)
    } catch (error) {
      this.userLoggerService.error(`Error deleting directory "${version.folder}":`, error)
      return version
    }
  }

  public async checkLocalModpack(version: MCGameVersion): Promise<MCGameVersion> {
    try {
      if (version.forge) {
        return await this.installForgeGame(version)
      }

      return await this.installNativeGame(version)
    } catch (error) {
      this.userLoggerService.error(`Error while checking custom modpack: `, error)
      return version
    }
  }

  public async launchGame(version: MCGameVersion): Promise<ChildProcess> {
    const { status } = version
    if (!status?.native || !status?.libs || !version.folder) {
      throw Error(`Game ${version.name} not ready`)
    }

    if (!(await this.isJavaExecutableExists(version.java))) {
      await this.installJava(version.java)
    }

    const javaPath = this.hardwareService.getJavaExecutablePath(version.java)
    const userName = this.userConfigService.get('userName')
    const userId = this.userConfigService.get('userId')
    const accessToken = this.userConfigService.get('accessToken')
    const minMemory = this.userConfigService.get('javaArgsMinMemory')
    const maxMemory = this.userConfigService.get('javaArgsMaxMemory')
    const width = this.userConfigService.get('resolutionWidth')
    const height = this.userConfigService.get('resolutionHeight')
    const fullscreen = this.userConfigService.get('resolutionFullscreen') as undefined | true

    const launchOptions: LaunchOption = {
      gamePath: version.folder,
      javaPath: javaPath,
      version: version.fullVersion,
      gameProfile: { name: userName, id: userId },
      accessToken,
      //   userType: 'legacy',
      // resourcePath: root,
      minMemory,
      maxMemory,
      server: version.server,
      // nativeRoot: join(
      //   root,
      //   'versions',
      //   `${version.number}-forge-${forge}`,
      //   `${version.number}-forge-${forge}-natives`
      // ),
      resolution: {
        width,
        height,
        fullscreen
      }
    }

    this.userLoggerService.info(`Start ${version.name} with args: `, launchOptions)

    const process = await launch(launchOptions)

    process.stdout?.setEncoding('utf-8')
    process.stdout?.on('data', (data) => this.userLoggerService.log(`${version.name}: `, data))

    process.stderr?.setEncoding('utf-8')
    process.stderr?.on('data', (data) => this.userLoggerService.error(`${version.name}: `, data))

    return process
  }
}
