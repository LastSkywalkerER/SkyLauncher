import { existsSync } from 'node:fs'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { createWriteStream, mkdirSync, promises as fsPromises } from 'fs'
import { join } from 'path'
import { Transform } from 'stream'
import { pipeline } from 'stream/promises'
import { Agent, request } from 'undici'

import { tempExtension } from '../../../../shared/constants'
import { ProcessProgressService } from '../../process-progress/process-progress.service'
import { DownloadRequest, DownloadResponse, IDownloaderService } from '../downloader.interface'

@Injectable()
export class UndiciDownloaderService implements IDownloaderService {
  private readonly logger = new Logger(UndiciDownloaderService.name)
  // private undiciClient = new Agent({ connections: 10, pipelining: 1 })

  constructor(
    @Inject('UNDICI_CLIENT') private readonly undiciClient: Agent,
    @Inject(ProcessProgressService)
    private readonly processProgressService: ProcessProgressService
  ) {}

  public async download({
    fileUrl,
    outputDirectory,
    fileName,
    additionalUrls
  }: DownloadRequest): Promise<DownloadResponse> {
    const downloadingProgress = this.processProgressService.getLogger()
    const finishedFilePath = join(outputDirectory, fileName)
    const tempZipPath = finishedFilePath + tempExtension
    const backupUrls = additionalUrls || []

    if (!fileUrl) {
      if (backupUrls.length) {
        return this.download({
          fileUrl: backupUrls.shift(),
          outputDirectory,
          fileName,
          additionalUrls: backupUrls
        })
      }
      throw new Error('No valid URLs provided')
    }

    if (!existsSync(outputDirectory)) {
      mkdirSync(outputDirectory, { recursive: true })
    }

    const fileStream = createWriteStream(tempZipPath)

    downloadingProgress.init({
      processName: `Downloading ${fileName}`,
      maxValue: 0,
      minValue: 0,
      unit: 'bytes',
      currentValue: 0,
      status: 'inited'
    })

    try {
      const response = await request(fileUrl, {
        method: 'GET',
        dispatcher: this.undiciClient
      })

      if (response.statusCode === 302 || response.statusCode === 301) {
        const location = response.headers['location']
        const redirectUrl = Array.isArray(location) ? location[0] : location

        if (redirectUrl) {
          return this.download({
            fileUrl: redirectUrl,
            outputDirectory,
            fileName,
            additionalUrls
          })
        }
      }

      if (response.statusCode !== 200) {
        if (backupUrls.length) {
          return this.download({
            fileUrl: backupUrls.shift(),
            outputDirectory,
            fileName,
            additionalUrls: backupUrls
          })
        }
        throw new Error(
          `Download failed: ${response.statusCode} - ${response.headers['reason-phrase'] || 'Unknown error'}`
        )
      }

      const contentLength = response.headers['content-length']
      const totalSize = parseInt(
        Array.isArray(contentLength) ? contentLength[0] : contentLength || '0',
        10
      )
      this.logger.log(`Downloading file ${fileName} size ${totalSize} ...`)

      downloadingProgress.set({ status: 'started', maxValue: totalSize })

      const progressTransformer = new Transform({
        transform(chunk, _, callback): void {
          downloadingProgress.set({ status: 'inProgress' }, { additionalValue: chunk.length })
          callback(null, chunk)
        }
      })

      await pipeline(response.body, progressTransformer, fileStream)

      await fsPromises.rename(tempZipPath, finishedFilePath)
      downloadingProgress.set({ status: 'finished' })

      return { filePath: finishedFilePath }
    } catch (error) {
      this.logger.error(
        `${(error as Error).message} - ${JSON.stringify(downloadingProgress.get())}`,
        (error as Error).stack
      )
      downloadingProgress.set({ status: 'finished' })
      throw error
    }
  }
}
