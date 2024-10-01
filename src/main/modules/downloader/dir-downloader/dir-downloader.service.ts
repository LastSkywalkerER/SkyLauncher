import { Inject, Injectable } from '@nestjs/common'
import { DownloadFolderOptions } from './dir-downloader.interface'
import * as path from 'node:path'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { DownloaderClientService } from '../downloader-client/downloader-client.service'

@Injectable()
export class DirDownloaderService {
  constructor(
    @Inject(DownloaderClientService)
    private readonly downloaderClientService: DownloaderClientService
  ) {}

  public async downloadFolder({
    bucketName,
    debug,
    destinationPath,
    folderName
  }: DownloadFolderOptions): Promise<string> {
    const downloadClient = this.downloaderClientService.get()
    const folderPrefix = folderName + '/' // Укажите нужный префикс (папку)
    const localDownloadPath = destinationPath || './downloads' // Путь, куда будут скачаны файлы

    // Функция для создания директории, если её нет
    const ensureDirectoryExistence = (filePath): boolean => {
      const dirname = path.dirname(filePath)
      if (existsSync(dirname)) {
        return true
      }
      mkdirSync(dirname, { recursive: true })
      return false
    }

    const objectsStream = downloadClient.listObjectsV2(bucketName, folderPrefix, true)

    objectsStream.on('data', async (obj) => {
      if (obj.size > 0 && obj.name) {
        // Только для файлов, а не папок
        const localFilePath = path.join(localDownloadPath, obj.name)

        // Убедиться, что директория существует
        ensureDirectoryExistence(localFilePath)

        // Проверить, существует ли файл на локальной машине
        if (existsSync(localFilePath)) {
          debug(`File already exists, skipping: ${localFilePath}`)
          return // Пропустить загрузку, если файл существует
        }

        try {
          // Скачать файл, если его нет
          const dataStream = await downloadClient.getObject(bucketName, obj.name)
          const file = createWriteStream(localFilePath)
          dataStream.pipe(file)

          file.on('finish', () => {
            debug(`Downloaded: ${localFilePath}`)
          })
        } catch (err) {
          console.error('Error downloading object:', err)
        }
      }
    })

    objectsStream.on('end', () => {
      debug('All files have been downloaded or skipped.')
    })

    objectsStream.on('error', (err) => {
      debug(`Error listing objects: ${String(err)}`)
    })

    return path.join(localDownloadPath, folderPrefix)
  }
}
