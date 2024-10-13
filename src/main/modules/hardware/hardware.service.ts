import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { app } from 'electron'
import { join } from 'path'
import { launcherName } from '../../../constants'
import { UserConfigService } from '../user-config/user-config.service'

@Injectable()
export class HardwareService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService
  ) {}

  public getPlatform(): typeof process.platform {
    return this.configService.get('hardware.platform') || process.platform
  }

  public getArchitecture(): typeof process.arch {
    return this.configService.get('hardware.architecture') || process.arch
  }

  /**
   * @deprecated Must be replaced by user-config
   * TODO: Must be replaced by user-config
   */
  public async getAppDir(): Promise<string> {
    return join(app.getPath('appData'), launcherName)
  }

  public getJavaDir(version?: string): string {
    return join(
      this.userConfigService.get<'directoriesPaths.java'>('directoriesPaths.java'),
      this.getPlatform(),
      this.getArchitecture(),
      version || String(this.userConfigService.get<'javaArgs.version'>('javaArgs.version'))
    )
  }

  public getJavaExecutablePath(version?: string): string {
    return join(
      this.getJavaDir(version),
      this.getPlatform() === 'win32' ? '/bin/java.exe' : '/bin/java'
    )
  }

  public multiplatformJoin(...paths: string[]): string {
    return this.fixPlatformPath(join(...paths))
  }

  public fixPlatformPath(path: string): string {
    return path.replace(/\\/g, '/')
  }
}
