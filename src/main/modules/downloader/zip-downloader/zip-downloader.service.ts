import { existsSync, mkdirSync, createWriteStream, promises as fsPromises } from 'fs'
import { Inject, Injectable } from '@nestjs/common'
import { DownloadAndUnzipOptions } from './zip-downloader.interface'
import { join } from 'path'
import { extract } from 'zip-lib'
import { DownloaderClientService } from '../downloader-client/downloader-client.service'
import { HardwareService } from '../../hardware/hardware.service'

@Injectable()
export class ZipDownloaderService {
  constructor(
    @Inject(DownloaderClientService)
    private readonly downloaderClientService: DownloaderClientService,
    @Inject(HardwareService) private readonly hardwareService: HardwareService
  ) {}

  public async downloadAndUnzip({
    bucketName,
    debug,
    destinationPath,
    version,
    zipPath
  }: DownloadAndUnzipOptions): Promise<string> {
    const downloadClient = this.downloaderClientService.get()
    const objectName = this.hardwareService.multiplatformJoin(zipPath, `${version}.zip`) // Путь к файлу в бакете
    const outputDirectory = join(destinationPath, zipPath) || './downloads' // Локальная директория для разархивирования
    const extractedFileCheckPath = join(outputDirectory, version) // Проверка наличия разархивированной версии

    try {
      // Проверяем, существует ли уже разархивированная версия
      if (existsSync(extractedFileCheckPath)) {
        debug(
          `Extracted files already exist in ${extractedFileCheckPath}, skipping download and extraction.`
        )
        return extractedFileCheckPath
      }

      debug(`Downloading and extracting ${objectName} from bucket ${bucketName}...`)

      // Убедимся, что директория для распаковки существует
      if (!existsSync(outputDirectory)) {
        mkdirSync(outputDirectory, { recursive: true })
      }

      // Получаем объект (ZIP файл) из MinIO
      const dataStream = await downloadClient.getObject(bucketName, objectName)

      // Сохранение ZIP-файла во временную директорию
      const tempZipPath = join(outputDirectory, `${version}.zip`)
      const writeStream = createWriteStream(tempZipPath)

      // Получение объекта с помощью потоков данных
      const stat = await downloadClient.statObject(bucketName, objectName)
      const totalSize = stat.size

      let downloadedBytes = 0

      // Пишем поток данных в ZIP файл
      dataStream.pipe(writeStream)

      await new Promise((resolve, reject) => {
        writeStream.on('finish', async () => {
          try {
            debug(`Extracting ZIP file to ${outputDirectory}`)

            // Распаковка архива с учетом символических ссылок
            await extract(tempZipPath, outputDirectory, {
              onEntry: (entry) => {
                // Обновляем статус распаковки
                debug(`Extracting: ${entry.entryName}`)
              }
            })

            debug(`Extraction complete. Files are saved in ${outputDirectory}`)

            // Удаление ZIP файла после успешного разархивирования
            await fsPromises.unlink(tempZipPath)

            resolve(true)
          } catch (err) {
            debug(`Error during extraction: ${err}`)
            reject()
          }
        })

        writeStream.on('error', (err) => {
          debug(`Error writing ZIP file to local system: ${err}`)
          reject()
        })

        dataStream.on('data', (chunk) => {
          downloadedBytes += chunk.length // Увеличиваем количество загруженных байтов
          const downloadPercentage = ((downloadedBytes / totalSize) * 100).toFixed(2)
          debug(`Download progress: ${downloadPercentage}%`) // Обновляем статус загрузки
        })

        dataStream.on('end', () => {
          const finalPercentage = 100
          debug(`Download complete: ${finalPercentage}%`) // Статус загрузки 100%
        })
      })
    } catch (err) {
      debug(`Error downloading or extracting ${objectName}: ${err}`)
    }

    return extractedFileCheckPath
  }

  // private async getListFoldersInBucket(
  //   bucketName: string,
  //   debug: (data: string) => void,
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
  //       debug(`Ошибка при получении списка объектов: ${JSON.stringify(err)}`)
  //       reject(err)
  //     })
  //
  //     stream.on('end', () => {
  //       debug(`Список папок в бакете: ${JSON.stringify(Array.from(folders))}`)
  //       debug(`Список файлов в бакете: ${JSON.stringify(Array.from(files))}`)
  //       // Возвращаем список папок и файлов
  //       resolve({ folders: Array.from(folders), files: Array.from(files) })
  //     })
  //   })
  // }
}
