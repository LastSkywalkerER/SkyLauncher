import { Controller } from '@nestjs/common'
import { Version } from '../launcher/launcher.interfaces'
import { IpcHandle } from '@doubleshot/nest-electron'
import { versions } from '../../utils/launcher/versions'
import { IPCHandleNames } from '../../constants'

@Controller()
export class VersionsController {
  @IpcHandle(IPCHandleNames.GetMinecraftVersions)
  public handleGetMinecraftVersions(): Record<string, Version> {
    return versions
  }
}
