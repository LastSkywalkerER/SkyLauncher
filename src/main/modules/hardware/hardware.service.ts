import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { app } from 'electron'
import { join } from 'path'
import { launcherName } from '../../constants'

@Injectable()
export class HardwareService {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  public getPlatform(): typeof process.platform {
    return this.configService.get('hardware.platform') || process.platform
  }

  public getArchitecture(): typeof process.arch {
    return this.configService.get('hardware.architecture') || process.arch
  }

  public async getAppDir(): Promise<string> {
    return join(app.getPath('appData'), launcherName)
  }

  public getJavaExecutableName(): string {
    return this.getPlatform() === 'win32' ? '/bin/java.exe' : '/bin/java'
  }

  public multiplatformJoin(...paths: string[]): string {
    return this.fixPlatformPath(join(...paths))
  }

  public fixPlatformPath(path: string): string {
    return path.replace(/\\/g, '/')
  }
}
