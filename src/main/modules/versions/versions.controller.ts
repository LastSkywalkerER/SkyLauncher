import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject } from '@nestjs/common'

import { IPCHandleNames } from '../../../shared/constants'
import { IMCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.interface'
import { DirScannerService } from '../dir-scanner/dir-scanner.service'
import { MetadataService } from '../metadata/metadata.service'

@Controller()
export class VersionsController {
  constructor(
    @Inject(DirScannerService) private readonly dirScannerService: DirScannerService,
    @Inject(MetadataService) private readonly metadataService: MetadataService
  ) {}

  @IpcHandle(IPCHandleNames.GetLocalMCVersions)
  public async handleGetLocalMCVersions(): Promise<IMCGameVersion[]> {
    const modpacks = await this.dirScannerService.getModpacks()

    return (
      await Promise.all(modpacks.map(async (item) => await this.metadataService.parse(item.name)))
    ).filter((item) => !!item)
  }
}
