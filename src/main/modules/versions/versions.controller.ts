import { Controller } from '@nestjs/common'
import { Version } from '../launcher/launcher.interfaces'
import { IpcHandle } from '@doubleshot/nest-electron'
import { versions } from '../../utils/launcher/versions'

@Controller()
export class VersionsController {
  @IpcHandle('getMinceraftVersions')
  public handleGetMinceraftVersions(): Record<string, Version> {
    return versions
  }
}
