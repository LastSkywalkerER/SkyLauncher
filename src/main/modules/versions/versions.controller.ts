import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'

import { IPCHandleNames } from '../../../shared/constants'
import { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import { FilesystemService } from '../filesystem/filesystem.service'
import { MetadataService } from '../metadata/metadata.service'

@Controller()
export class VersionsController {
  constructor(
    @Inject(FilesystemService) private readonly dirScannerService: FilesystemService,
    @Inject(MetadataService) private readonly metadataService: MetadataService
  ) {}

  @IpcHandle(IPCHandleNames.GetLocalMCVersions)
  public async handleGetLocalMCVersions(): Promise<IMCGameVersion[]> {
    const modpacks = await this.dirScannerService.getModpacks()

    return (
      await Promise.all(modpacks.map(async (item) => await this.metadataService.parse(item.name)))
    ).filter((item) => !!item)
  }

  @IpcHandle(IPCHandleNames.UpdateLocalMCVersion)
  public async handleUpdateMCVersion(
    @Payload() { version }: { version: Partial<IMCGameVersion> }
  ): Promise<void> {
    await this.metadataService.update(version)
  }
}
