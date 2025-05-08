import { ChildProcess } from 'node:child_process'

import { prettyLogObject } from '@main/utils/pretty-log-object'
import { Inject, Logger } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { launch, LaunchOption } from '@xmcl/core'

import { HardwareService } from '../../../libs/hardware/hardware.service'
import { JavaService } from '../../../libs/java/java.service'
import { UserConfigService } from '../../user-config/user-config.service'
import { LaunchHandlerBase } from '../launcher.handler'
import { LaunchModpackCommand } from './launch-modpack.command'

@CommandHandler(LaunchModpackCommand)
export class LaunchModpackHandler extends LaunchHandlerBase {
  private readonly logger = new Logger(LaunchModpackHandler.name)

  constructor(
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    @Inject(JavaService) private readonly javaService: JavaService
    // @Inject(ProcessProgressService) private readonly processProgressService: ProcessProgressService
  ) {
    super()
  }

  public async execute({ target, user }: LaunchModpackCommand): Promise<ChildProcess> {
    const localTarget = target.update({})

    this.logger.log(`Launching ${prettyLogObject(localTarget)}`)

    try {
      if (!localTarget.status?.native || !localTarget.status?.libs || !localTarget.folder) {
        throw Error(`Game ${localTarget.name} not ready`)
      }

      if (!(await this.javaService.isJavaExecutableExists(localTarget.java))) {
        await this.javaService.install(localTarget.java)
      }

      // User
      const userName = user.userName
      const userId = user.userId ?? ''
      const accessToken = user.accessToken ?? ''

      // Settings
      const javaPath = this.hardwareService.getJavaExecutablePath(localTarget.java)
      const javaArgs = localTarget.javaArgs ? localTarget.javaArgs.split(' ') : undefined
      const minMemory =
        localTarget.javaArgsMinMemory || this.userConfigService.get('javaArgsMinMemory')
      const maxMemory =
        localTarget.javaArgsMaxMemory || this.userConfigService.get('javaArgsMaxMemory')
      const width = localTarget.width || this.userConfigService.get('resolutionWidth')
      const height = localTarget.height || this.userConfigService.get('resolutionHeight')
      const fullscreen =
        localTarget.fullscreen ||
        (this.userConfigService.get('resolutionFullscreen') as undefined | true)

      const launchOptions: LaunchOption = {
        gamePath: localTarget.folder,
        javaPath: javaPath,
        version: localTarget.fullVersion,
        gameProfile: { name: userName, id: userId },
        accessToken,
        // userType: 'legacy',
        // resourcePath: root,
        minMemory,
        maxMemory,
        server: localTarget.server,
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
        },
        extraExecOption: { detached: true },
        extraJVMArgs: javaArgs
      }

      this.logger.log(`Start ${localTarget.name} with args: ${prettyLogObject(launchOptions)}`)

      const process = await launch(launchOptions)

      process.stdout?.setEncoding('utf-8')
      process.stdout?.on('data', (data) => this.logger.log(`${localTarget.name}: ${data}`))

      process.stderr?.setEncoding('utf-8')
      process.stderr?.on('data', (data) => this.logger.error(`${localTarget.name}: `, data))

      process.on('close', (code) => {
        if (code === 0) {
          this.logger.log(`${localTarget.name} closed with code ${code}`)
        } else {
          this.logger.error(`${localTarget.name} closed with code ${code}`)
        }
      })

      return process
    } catch (error) {
      this.logger.error(
        `Failed to launch game: ${(error as Error).message}`,
        (error as Error).stack
      )
      throw error
    }
  }
}
