import { ChildProcess } from 'node:child_process'

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
  ) {
    super()
  }

  public async execute({ target }: LaunchModpackCommand): Promise<ChildProcess> {
    const localTarget = target.update({})

    this.logger.log(`Launching ${JSON.stringify(localTarget)}`)

    if (!localTarget.status?.native || !localTarget.status?.libs || !localTarget.folder) {
      throw Error(`Game ${localTarget.name} not ready`)
    }

    if (!(await this.javaService.isJavaExecutableExists(localTarget.java))) {
      await this.javaService.install(localTarget.java)
    }

    const javaPath = this.hardwareService.getJavaExecutablePath(localTarget.java)
    const userName = this.userConfigService.get('userName')
    const userId = this.userConfigService.get('userId')
    const accessToken = this.userConfigService.get('accessToken')
    const minMemory = this.userConfigService.get('javaArgsMinMemory')
    const maxMemory = this.userConfigService.get('javaArgsMaxMemory')
    const width = this.userConfigService.get('resolutionWidth')
    const height = this.userConfigService.get('resolutionHeight')
    const fullscreen = this.userConfigService.get('resolutionFullscreen') as undefined | true

    const launchOptions: LaunchOption = {
      gamePath: localTarget.folder,
      javaPath: javaPath,
      version: localTarget.fullVersion,
      gameProfile: { name: userName, id: userId },
      accessToken,
      userType: 'legacy',
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
      extraExecOption: { detached: true }
    }

    this.logger.log(`Start ${localTarget.name} with args: `, launchOptions)

    const process = await launch(launchOptions)

    process.stdout?.setEncoding('utf-8')
    process.stdout?.on('data', (data) => this.logger.log(`${localTarget.name}: ${data}`))

    process.stderr?.setEncoding('utf-8')
    process.stderr?.on('data', (data) => this.logger.error(`${localTarget.name}: `, data))

    return process
  }
}
