import { Inject, Injectable, Logger } from '@nestjs/common'
import { promises as fsPromises } from 'fs'
import { extract } from 'zip-lib'

import { ProcessProgressService } from '../process-progress/process-progress.service'
import { IUnzipService, UnzipRequest, UnzipResponse } from './unzip.interface'

@Injectable()
export class UnzipService implements IUnzipService {
  private readonly logger = new Logger(UnzipService.name)

  constructor(
    @Inject(ProcessProgressService)
    private readonly processProgressService: ProcessProgressService
  ) {}

  public async execute({ inputPath, outputPath }: UnzipRequest): Promise<UnzipResponse> {
    const unzipProgress = this.processProgressService.getLogger()
    unzipProgress.init({
      processName: `Extracting ${inputPath.split('/').at(-1)}`,
      status: 'inited',
      currentValue: 0,
      maxValue: 1,
      minValue: 0,
      unit: 'files'
    })

    try {
      this.logger.log(`Extracting ZIP file to ${outputPath}`)
      unzipProgress.set({ status: 'started' })

      // unzip with symlinks
      await extract(inputPath, outputPath, {
        // overwrite: true,
        onEntry: (entry) => {
          unzipProgress.set(
            { status: 'inProgress', maxValue: entry.entryCount },
            { additionalValue: 1 }
          )
        }
      })

      this.logger.log(`Extraction complete. Files are saved in ${outputPath}`)

      // Remove old zip file
      await fsPromises.unlink(inputPath)
      this.logger.log(`Removed temp zip file ${inputPath}`)

      return { filePath: outputPath }
    } catch (err) {
      this.logger.error(`Error during extraction: ${err}`)
      throw err
    } finally {
      unzipProgress.set({ status: 'finished' })
    }
  }
}
