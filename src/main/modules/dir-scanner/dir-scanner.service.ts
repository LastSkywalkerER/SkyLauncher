import { Dirent, existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'

import { Inject, Injectable } from '@nestjs/common'

import { UserConfigService } from '../user-config/user-config.service'

@Injectable()
export class DirScannerService {
  constructor(@Inject(UserConfigService) private readonly userConfigService: UserConfigService) {}
  public async getModpacks(): Promise<Dirent[]> {
    const modpacksDir = this.userConfigService.get('modpacksPath')

    if (!existsSync(modpacksDir)) {
      return []
    }

    // Get the list of all files and folders in the directory
    const items = await readdir(modpacksDir, { withFileTypes: true })

    return items.filter((item) => {
      // Check if the item is a directory
      return item.isDirectory()
    })
  }
}
