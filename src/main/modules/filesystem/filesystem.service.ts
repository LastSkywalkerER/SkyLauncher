import { Dirent, existsSync } from 'node:fs'
import { readdir, rmdir, unlink } from 'node:fs/promises'
import { basename, join } from 'node:path'

import { Inject, Injectable, Logger } from '@nestjs/common'

import { ProcessProgressService } from '../../libs/process-progress/process-progress.service'
import { UserConfigService } from '../user-config/user-config.service'

@Injectable()
export class FilesystemService {
  private readonly logger = new Logger(FilesystemService.name)

  constructor(
    @Inject(UserConfigService) private readonly userConfigService: UserConfigService,
    @Inject(ProcessProgressService)
    private readonly processProgressService: ProcessProgressService
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
    const progress = this.processProgressService.getLogger()
    const processName = `removeFolder:${basename(folderPath)}`

    if (!existsSync(folderPath)) {
      this.logger.log(`Folder doesn't exists: ${folderPath}`)
      progress.set({
        processName,
        status: 'failed'
      })
      return
    }

    const entries = await readdir(folderPath, { withFileTypes: true })

    progress.set({
      processName,
      status: 'started',
      minValue: 0,
      maxValue: entries.length,
      currentValue: 0,
      unit: 'files'
    })

    for (const entry of entries) {
      const fullPath = join(folderPath, entry.name)
      if (entry.isDirectory()) {
        this.logger.log(`Removing folder: ${fullPath}`)

        await this.removeFolder(fullPath)
      } else {
        this.logger.log(`Removing file: ${fullPath}`)

        await unlink(fullPath)
      }

      progress.set(
        {
          status: 'inProgress'
        },
        { additionalValue: 1 }
      )
    }

    this.logger.log(`Removing root folder: ${folderPath}`)
    await rmdir(folderPath)

    progress.set({
      status: 'finished'
    })
  }
}
