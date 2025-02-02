import { Inject, Injectable, Logger } from '@nestjs/common'
import { Version } from '@xmcl/core'
import {
  getForgeVersionList,
  getVersionList,
  installAssetsTask,
  installForgeTask,
  installLibrariesTask,
  installTask,
  installVersionTask
} from '@xmcl/installer'
import { Task } from '@xmcl/task'
import { Agent, Dispatcher, interceptors } from 'undici'

import { Modloader } from '../../../shared/constants'
import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'
import { HardwareService } from '../hardware/hardware.service'
import { ProcessProgressService } from '../process-progress/process-progress.service'

@Injectable()
export class InstallerService {
  private logger = new Logger(InstallerService.name)
  private readonly _agent: Dispatcher

  constructor(
    @Inject('CONNECTIONS_AMOUNT') private readonly connectionsAmount: number,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    @Inject(ProcessProgressService)
    private readonly processProgressService: ProcessProgressService
  ) {
    this._agent = new Agent({
      connections: this.connectionsAmount
    }).compose(interceptors.retry(), interceptors.redirect())
  }

  public async install(target: MCGameVersion): Promise<MCGameVersion> {
    const localTarget = target.update({})

    if (!localTarget.jsonUrl) {
      const availableVersions = await getVersionList()

      const jsonUrl = availableVersions.versions.find(({ id }) => id === localTarget.version)?.url

      localTarget.update({ jsonUrl })
    }

    if (!localTarget.status.native) {
      this.logger.log(
        `Installing native version with dependencies ${localTarget.version} from ${localTarget.jsonUrl} to ${localTarget.folder}`
      )

      // await install(
      //   {
      //     url: localTarget.jsonUrl!,
      //     id: localTarget.version
      //   },
      //   localTarget.folder!
      // )

      await this.handleTask(
        installTask(
          {
            url: localTarget.jsonUrl!,
            id: localTarget.version
          },
          localTarget.folder!,
          {
            dispatcher: this._agent
          }
        ).setName(`Installing ${localTarget.version} with dependencies`)
      )

      localTarget.updateStatus({ native: true, assets: true, libs: true })
    }

    return localTarget
  }

  public async installVersion(target: MCGameVersion): Promise<MCGameVersion> {
    const localTarget = target.update({})

    if (!localTarget.jsonUrl) {
      const availableVersions = await getVersionList()

      const jsonUrl = availableVersions.versions.find(({ id }) => id === localTarget.version)?.url

      localTarget.update({ jsonUrl })
    }

    if (!localTarget.status.native) {
      this.logger.log(
        `Installing native version ${localTarget.version} from ${localTarget.jsonUrl} to ${localTarget.folder}`
      )
      // await installVersion(
      //   {
      //     url: localTarget.jsonUrl!,
      //     id: localTarget.version
      //   },
      //   localTarget.folder!
      // )

      await this.handleTask(
        installVersionTask(
          {
            url: localTarget.jsonUrl!,
            id: localTarget.version
          },
          localTarget.folder!,
          {
            dispatcher: this._agent
          }
        ).setName(`Installing ${localTarget.version}`)
      )

      localTarget.updateStatus({ native: true })
    }

    return localTarget
  }
  public async installAssets(target: MCGameVersion): Promise<MCGameVersion> {
    const localTarget = target.update({})

    if (!localTarget.status.assets) {
      const resolvedVersion = await Version.parse(localTarget.folder!, localTarget.version)

      this.logger.log(`Installing assets for ${resolvedVersion.id} to ${localTarget.folder}`)

      // await installAssets(resolvedVersion)

      await this.handleTask(
        installAssetsTask(resolvedVersion, {
          dispatcher: this._agent
        }).setName(`Installing assets`)
      )

      localTarget.updateStatus({ assets: true })
    }

    return localTarget
  }

  public async installLibraries(target: MCGameVersion): Promise<MCGameVersion> {
    const localTarget = target.update({})

    if (!localTarget.status.libs) {
      const resolvedVersion = await Version.parse(localTarget.folder!, localTarget.version)

      this.logger.log(`Installing libraries for ${resolvedVersion.id} to ${localTarget.folder}`)

      // await installLibraries(resolvedVersion)

      await this.handleTask(
        installLibrariesTask(resolvedVersion, {
          dispatcher: this._agent
        }).setName(`Installing libraries`)
      )

      localTarget.updateStatus({ libs: true })
    }

    return localTarget
  }
  public async installForge(target: MCGameVersion): Promise<MCGameVersion> {
    const localTarget = target.update({})
    const javaPath = this.hardwareService.getJavaExecutablePath(localTarget.java)

    if (localTarget.modloader && !localTarget.modloaderVersion) {
      this.logger.log(
        `Getting the latest version of ${localTarget.version}-${localTarget.modloader}`
      )

      const response = await getForgeVersionList({
        minecraft: localTarget.version,
        dispatcher: this._agent
      })

      const newestRecommended = response.versions.find((item) => item.type === 'latest')

      localTarget.updateVersion({
        modloader: Modloader.Forge,
        modloaderVersion: newestRecommended!.version
      })
    }

    if (localTarget.modloader && localTarget.modloaderVersion && !localTarget.status.modloader) {
      this.logger.log(
        `Installing ${localTarget.version}-${localTarget.modloader}-${localTarget.modloaderVersion}`
      )

      // await installForge(
      //   { mcversion: localTarget.version, version: localTarget.modloaderVersion },
      //   localTarget.folder!,
      //   { java: javaPath }
      // )

      await this.handleTask(
        installForgeTask(
          { mcversion: localTarget.version, version: localTarget.modloaderVersion },
          localTarget.folder!,
          {
            java: javaPath,
            dispatcher: this._agent
          }
        ).setName(`Installing ${localTarget.modloader}-${localTarget.modloaderVersion}`)
      )

      localTarget.updateStatus({
        modloader: true
      })
    }

    return localTarget
  }

  public async installModloader(target: MCGameVersion): Promise<MCGameVersion> {
    const localTarget = target.update({})

    if (localTarget.modloader === Modloader.Forge) {
      localTarget.update(await this.installForge(localTarget))
    }

    if (localTarget.modloader === Modloader.Fabric) {
      throw Error('Fabric installer not implemented')
    }

    localTarget.updateStatus({ modloader: true })

    return localTarget
  }

  private async handleTask(task: Task): Promise<unknown> {
    this.logger.log(`Task ${task.name} started`)
    const taskProcess = this.processProgressService.getLogger()
    taskProcess.init({
      processName: task.name,
      status: 'inited',
      unit: 'bytes',
      maxValue: 1,
      minValue: 0,
      currentValue: 0
    })

    return task.startAndWait({
      onStart: (task) => {
        taskProcess.set({ status: 'started', maxValue: task.total, currentValue: task.progress })
      },
      onUpdate: (task) => {
        taskProcess.set({ status: 'inProgress', maxValue: task.total, currentValue: task.progress })
      },
      onSucceed: (task, result) => {
        this.logger.log(result)
        taskProcess.set({ status: 'finished', maxValue: task.total, currentValue: task.progress })
      },
      onFailed: (task, error) => {
        this.logger.error(JSON.stringify(error))

        if (error instanceof AggregateError) {
          error.errors.forEach((error) => this.logger.error(JSON.stringify(error)))
        }

        taskProcess.set({ status: 'finished', maxValue: task.total, currentValue: task.progress })
      },
      onCancelled: (task) => {
        taskProcess.set({ status: 'finished', maxValue: task.total, currentValue: task.progress })
      }
    })
  }
}
