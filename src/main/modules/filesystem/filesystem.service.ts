import { Dirent, existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import * as path from 'node:path'

import { Inject, Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs'

// import { ProcessProgressService } from '../../libs/process-progress/process-progress.service'
import { UserConfigService } from '../user-config/user-config.service'

@Injectable()
export class FilesystemService {
  private readonly logger = new Logger(FilesystemService.name)

  constructor(
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService
    // @Inject(ProcessProgressService)
    // private readonly processProgressService: ProcessProgressService
  ) {}
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

  public async removeFolder(folderPath: string): Promise<void> {
    if (!fs.existsSync(folderPath)) {
      this.logger.log(`Folder doesn't exists: ${folderPath}`)
      return
    }

    const entries = fs.readdirSync(folderPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(folderPath, entry.name)
      if (entry.isDirectory()) {
        this.logger.log(`Removing folder: ${fullPath}`)
        await this.removeFolder(fullPath)
      } else {
        this.logger.log(`Removing file: ${fullPath}`)
        fs.unlinkSync(fullPath)
      }
    }

    this.logger.log(`Removing root folder: ${folderPath}`)
    fs.rmdirSync(folderPath)
  }
}
