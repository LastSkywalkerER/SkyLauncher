import { existsSync, mkdirSync, createWriteStream, promises as fsPromises } from 'fs'
import { Inject, Injectable } from '@nestjs/common'
import { DownloadAndUnzipOptions } from './zip-downloader.interface'
import { join } from 'path'
import { extract } from 'zip-lib'
import { DownloaderClientService } from '../downloader-client/downloader-client.service'

@Injectable()
export class ZipDownloaderService {
  constructor(
    @Inject(DownloaderClientService)
    private readonly downloaderClientService: DownloaderClientService
  ) {}

  public async downloadAndUnzip({
    bucketName,
    debug,
    destinationPath,
    version,
    zipPath
  }: DownloadAndUnzipOptions): Promise<string> {
    const downloadClient = this.downloaderClientService.get()
    const objectName = join(zipPath, `${version}.zip`) // Путь к файлу в бакете
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

      // Пишем поток данных в ZIP файл
      dataStream.pipe(writeStream)

      await new Promise((resolve, reject) => {
        // Когда загрузка завершена, распаковываем ZIP файл с использованием zip-lib
        writeStream.on('finish', async () => {
          try {
            debug(`Extracting ZIP file to ${outputDirectory}`)

            // Распаковка архива с учетом символических ссылок
            await extract(tempZipPath, outputDirectory)

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

        dataStream.on('error', (err) => {
          debug(`Error downloading object: ${err}`)
          reject()
        })
      })
    } catch (err) {
      debug(`Error downloading or extracting ${objectName}: ${err}`)
    }

    return extractedFileCheckPath
  }
}
