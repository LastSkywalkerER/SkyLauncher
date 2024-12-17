import { existsSync } from 'node:fs'

import { Inject, Injectable } from '@nestjs/common'
import { createWriteStream, mkdirSync, promises as fsPromises } from 'fs'
import * as https from 'https'
import { join } from 'path'

import { ProcessStatus } from '../../../../shared/dtos/process-progress.dto'
import { ProcessProgressService } from '../../process-progress/process-progress.service'
import { UserLoggerService } from '../../user-logger/user-logger.service'
import { DownloadFromUrl } from './url-downloader.interface'

const tempName = '.temp'

@Injectable()
export class UrlDownloaderService {
  constructor(
    @Inject(ProcessProgressService)
    private readonly processProgressService: ProcessProgressService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
  ) {}

  public async download({ fileUrl, outputDirectory, fileName }: DownloadFromUrl): Promise<string> {
    const url = new URL(fileUrl)
    const finishedFilePath = join(outputDirectory, fileName)
    const tempZipPath = finishedFilePath + tempName

    if (!existsSync(outputDirectory)) {
      mkdirSync(outputDirectory, { recursive: true })
    }

    const fileStream = createWriteStream(tempZipPath)

    return new Promise((resolve, reject) => {
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

          const totalSize = parseInt(response.headers['content-length'] || '0', 10)
          let downloadedBytes = 0

          const setDownloadingProgress = (status: ProcessStatus, value: number): void =>
            this.processProgressService.set({
              id: '',
              processName: `Downloading ${fileName}`,
              status,
              currentValue: value,
              maxValue: totalSize,
              minValue: 0,
              unit: 'bytes'
            })

          this.userLoggerService.info(`Downloading file ${fileName} size ${totalSize} ...`)

          response.pipe(fileStream)

          setDownloadingProgress('started', 0)

          response.on('data', (chunk) => {
            console.log({ downloadedBytes })
            downloadedBytes += chunk.length

            setDownloadingProgress('inProgress', downloadedBytes)
          })

          fileStream.on('finish', async () => {
            console.log('finished', downloadedBytes)
            fileStream.close()
            await fsPromises.rename(tempZipPath, finishedFilePath)
            setDownloadingProgress('finished', downloadedBytes)
            resolve(finishedFilePath)
          })
        })
        .on('error', (err) => {
          console.log({ err })
          reject(err)
        })
    })
  }
}
