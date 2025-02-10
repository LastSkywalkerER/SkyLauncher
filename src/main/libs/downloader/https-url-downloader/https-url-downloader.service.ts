import { existsSync } from 'node:fs'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { createWriteStream, mkdirSync, promises as fsPromises } from 'fs'
import * as https from 'https'
import { join } from 'path'

import { tempExtension } from '../../../../shared/constants'
import { ProcessProgressService } from '../../process-progress/process-progress.service'
import { DownloadRequest, DownloadResponse, IDownloaderService } from '../downloader.interface'

@Injectable()
export class HttpsUrlDownloaderService implements IDownloaderService {
  private readonly logger = new Logger(HttpsUrlDownloaderService.name)

  constructor(
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
      return this.download({
        fileUrl: backupUrls.shift(),
        outputDirectory,
        fileName,
        additionalUrls: backupUrls
      })
    }

    const url = new URL(fileUrl)

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

    return new Promise<DownloadResponse>((resolve, reject) => {
      https
        .get(url, (response) => {
          if (response.statusCode === 302 && response.headers['location']) {
            resolve(
              this.download({
                fileUrl: response.headers['location'] as string,
                outputDirectory,
                fileName
              })
            )

            return
          }

          if (response.statusCode !== 200 && backupUrls.length) {
            resolve(
              this.download({
                fileUrl: backupUrls.shift(),
                outputDirectory,
                fileName,
                additionalUrls: backupUrls
              })
            )
          }

          if (response.statusCode !== 200 && !backupUrls.length) {
            throw Error(response.statusMessage)
          }

          const totalSize = parseInt(response.headers['content-length'] || '0', 10)
          this.logger.log(`Downloading file ${fileName} size ${totalSize} ...`)

          downloadingProgress.set({ status: 'started', maxValue: totalSize })

          response.pipe(fileStream)

          response.on('data', (chunk) => {
            downloadingProgress.set({ status: 'inProgress' }, { additionalValue: chunk.length })
          })

          fileStream.on('finish', async () => {
            fileStream.close()
            await fsPromises.rename(tempZipPath, finishedFilePath)
            downloadingProgress.set({ status: 'finished' })
            resolve({ filePath: finishedFilePath })
          })
        })
        .on('error', (err) => {
          this.logger.error(
            `${err.message} - ${JSON.stringify(downloadingProgress.get())}`,
            err.stack
          )
          downloadingProgress.set({ status: 'finished' })

          reject(err)
        })
    })
  }
}
