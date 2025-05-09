import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

import { UserConfigService } from '../../modules/user-config/user-config.service'

@Injectable()
export class HardwareService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService
  ) {}

  public getPlatform(): typeof process.platform {
    return this.configService.get('hardwarePlatform') || process.platform
  }

  public getArchitecture(): typeof process.arch {
    return this.configService.get('hardwareArchitecture') || process.arch
  }

  public getJavaDir(version?: string): string {
    return join(
      this.userConfigService.get('javaPath'),
      this.getPlatform(),
      this.getArchitecture(),
      version || String(this.userConfigService.get('javaArgsVersion'))
    )
  }

  public getJavaExecutablePath(version?: string): string {
    return join(
      this.getJavaDir(version),
      this.getPlatform() === 'win32' ? '/bin/java.exe' : '/bin/java'
    )
  }

  public getPlatformPathDevider(): string {
    return this.getPlatform() === 'win32' ? '\\' : '/'
  }

  public multiplatformJoin(...paths: string[]): string {
    return this.fixPlatformPath(join(...paths))
  }

  public fixPlatformPath(path: string): string {
    return path.replace(/\\/g, '/')
  }
}
