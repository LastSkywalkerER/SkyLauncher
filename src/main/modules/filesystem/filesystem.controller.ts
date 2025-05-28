import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject, Logger } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { dialog, shell } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'

import { IPCHandleNames } from '../../../shared/constants'
import {
  type FilePickerOptions,
  type FilePickerResult,
  type FolderPathDto
} from '../../../shared/dtos/filesystem.dto'
import { FilesystemService } from './filesystem.service'

@Controller()
export class FilesystemController {
  private readonly logger = new Logger(FilesystemController.name)

  constructor(@Inject(FilesystemService) private readonly _filesystemService: FilesystemService) {}

  @IpcHandle(IPCHandleNames.OpenFolder)
  public async handleOpenFolder(@Payload() { path }: FolderPathDto): Promise<string> {
    return shell.openPath(path)
  }

  @IpcHandle(IPCHandleNames.RemoveFolder)
  public async handleRemoveFolder(@Payload() { path }: FolderPathDto): Promise<void> {
    return this._filesystemService.removeFolder(path)
  }

  @IpcHandle(IPCHandleNames.ShowFilePickerDialog)
  public async handleShowFilePickerDialog(
    @Payload() options: FilePickerOptions
  ): Promise<FilePickerResult> {
    const result = await dialog.showOpenDialog({
      title: options.title,
      defaultPath: options.defaultPath,
      buttonLabel: options.buttonLabel,
      filters: options.filters,
      properties: options.properties || ['openFile']
    })

    return {
      canceled: result.canceled,
      filePaths: result.filePaths
    }
  }

  @IpcHandle(IPCHandleNames.ReadFile)
  public async handleReadFile(
    @Payload() filePath: string
  ): Promise<{ data: string; fileName: string }> {
    try {
      const fileName = path.basename(filePath)

      // Read file and convert to base64
      const fileBuffer = await fs.readFile(filePath)
      const base64Data = fileBuffer.toString('base64')

      return {
        data: base64Data,
        fileName
      }
    } catch (error) {
      this.logger.error('Read file error:', error)
      throw error
    }
  }
}
