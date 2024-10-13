import { existsSync, mkdirSync, createWriteStream, promises as fsPromises } from 'fs'
import { Inject, Injectable } from '@nestjs/common'
import * as https from 'https'
import { ProcessStatus } from '../../../../dtos/process-progress.dto'

import { ProcessProgressService } from '../../process-progress/process-progress.service'
import { UserLoggerService } from '../../user-logger/user-logger.service'
import { DownloadFromS3, DownloadFromUrl, Unzip } from './zip-downloader.interface'
import { join } from 'path'
import { extract } from 'zip-lib'
import { DownloaderClientService } from '../downloader-client/downloader-client.service'
import { HardwareService } from '../../hardware/hardware.service'

const tempName = '.temp'

@Injectable()
export class ZipDownloaderService {
  constructor(
    @Inject(DownloaderClientService)
    private readonly downloaderClientService: DownloaderClientService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService,
    @Inject(ProcessProgressService) private readonly processProgressService: ProcessProgressService,
    @Inject(UserLoggerService) private readonly userLoggerService: UserLoggerService
  ) {}

  public async downloadFromUrl({
    fileUrl,
    outputDirectory,
    fileName
  }: DownloadFromUrl): Promise<string> {
    const url = new URL(fileUrl)
    const finishedFilePath = join(outputDirectory, `${fileName}.zip`)
    const tempZipPath = finishedFilePath + tempName

    if (!existsSync(outputDirectory)) {
      mkdirSync(outputDirectory, { recursive: true })
    }

    const fileStream = createWriteStream(tempZipPath)

    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          const totalSize = parseInt(response.headers['content-length'] || '0', 10)
          let downloadedBytes = 0
          const setDownloadingProgress = (status: ProcessStatus, value: number): void =>
            this.processProgressService.set({
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
            downloadedBytes += chunk.length

            setDownloadingProgress('inProgress', downloadedBytes)
          })

          fileStream.on('finish', async () => {
            fileStream.close()
            await fsPromises.rename(tempZipPath, finishedFilePath)
            setDownloadingProgress('finished', downloadedBytes)
            resolve(finishedFilePath)
          })
        })
        .on('error', (err) => {
          reject(err)
        })
    })
  }

  public async downloadFromS3({
    bucketName,
    objectPath,
    outputDirectory,
    fileName
  }: DownloadFromS3): Promise<string> {
    const downloadClient = this.downloaderClientService.get()
    const stat = await downloadClient.statObject(bucketName, join(objectPath, `${fileName}.zip`))
    const dataStream = await downloadClient.getObject(
      bucketName,
      join(objectPath, `${fileName}.zip`)
    )
    const finishedDirectory = join(outputDirectory, objectPath)
    const finishedFilePath = join(finishedDirectory, `${fileName}.zip`)
    const tempZipPath = finishedFilePath + tempName
    let downloadedBytes = 0
    const setDownloadingProgress = (status: ProcessStatus, value: number): void =>
      this.processProgressService.set({
        processName: `Downloading ${fileName}`,
        status,
        currentValue: value,
        maxValue: stat.size,
        minValue: 0,
        unit: 'bytes'
      })

    this.userLoggerService.info(`Downloading file ${fileName} size ${stat.size} ...`)

    if (!existsSync(finishedDirectory)) {
      mkdirSync(finishedDirectory, { recursive: true })
    }

    const fileStream = createWriteStream(tempZipPath)
    dataStream.pipe(fileStream)

    setDownloadingProgress('started', 0)

    return new Promise((resolve, reject) => {
      dataStream.on('data', (chunk) => {
        downloadedBytes += chunk.length // Увеличиваем количество загруженных байтов

        setDownloadingProgress('inProgress', downloadedBytes)
      })

      fileStream.on('finish', async () => {
        fileStream.close()
        await fsPromises.rename(tempZipPath, finishedFilePath)
        setDownloadingProgress('finished', downloadedBytes)
        resolve(finishedFilePath)
      })

      dataStream.on('error', (error) => {
        fileStream.close()
        setDownloadingProgress('finished', downloadedBytes)
        reject(error)
      })
    })
  }

  public async unzip({ outputDirectory, zipPath }: Unzip): Promise<void> {
    let currentUnzipItemIndex = 0
    let unzipItemAmount = 0
    const setUnzipProgress = (status: ProcessStatus, value: number, maxValue: number = 0): void =>
      this.processProgressService.set({
        processName: `Extracting ${zipPath.split('/').at(-1)}`,
        status,
        currentValue: value,
        maxValue: maxValue,
        minValue: 0,
        unit: '%'
      })

    // await new Promise((resolve, reject) => {
    //   writeStream.on('finish', async () => {
    try {
      this.userLoggerService.info(`Extracting ZIP file to ${outputDirectory}`)
      setUnzipProgress('started', currentUnzipItemIndex)

      // Распаковка архива с учетом символических ссылок
      await extract(zipPath, outputDirectory, {
        // overwrite: true,
        onEntry: (entry) => {
          // Обновляем статус распаковки
          currentUnzipItemIndex++
          unzipItemAmount = entry.entryCount
          setUnzipProgress('inProgress', currentUnzipItemIndex, unzipItemAmount)
        }
      })

      this.userLoggerService.info(`Extraction complete. Files are saved in ${outputDirectory}`)

      // Удаление ZIP файла после успешного разархивирования
      await fsPromises.unlink(zipPath)
      this.userLoggerService.info(`Removed temp zip file ${zipPath}`)
      setUnzipProgress('finished', currentUnzipItemIndex, unzipItemAmount)
    } catch (err) {
      this.userLoggerService.error(`Error during extraction: ${err}`)
      setUnzipProgress('finished', currentUnzipItemIndex, unzipItemAmount)
    }
  }

  // private async getListFoldersInBucket(
  //   bucketName: string,
  //   this.userLoggerService.info: (data: string) => void,
  //   prefix = ''
  // ): Promise<{ folders: string[]; files: string[] }> {
  //   const downloadClient = this.downloaderClientService.get()
  //   const folders: Set<string> = new Set() // Для уникальных префиксов папок
  //   const files: Set<string> = new Set() // Для уникальных файлов
  //
  //   const stream = downloadClient.listObjects(bucketName, prefix, true)
  //
  //   return new Promise((resolve, reject): void => {
  //     stream.on('data', (obj) => {
  //       if (!obj.name) return
  //
  //       // Проверяем, если это папка или файл
  //       const parts = obj.name.split('/')
  //       if (parts.length > 1) {
  //         // Добавляем папку
  //         folders.add(parts[0])
  //       }
  //       // Добавляем файл
  //       files.add(obj.name)
  //     })
  //
  //     stream.on('error', (err) => {
  //       this.userLoggerService.info(`Ошибка при получении списка объектов: ${JSON.stringify(err)}`)
  //       reject(err)
  //     })
  //
  //     stream.on('end', () => {
  //       this.userLoggerService.info(`Список папок в бакете: ${JSON.stringify(Array.from(folders))}`)
  //       this.userLoggerService.info(`Список файлов в бакете: ${JSON.stringify(Array.from(files))}`)
  //       // Возвращаем список папок и файлов
  //       resolve({ folders: Array.from(folders), files: Array.from(files) })
  //     })
  //   })
  // }
}
