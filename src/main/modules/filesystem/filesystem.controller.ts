import { IpcHandle } from '@doubleshot/nest-electron'
import { Controller, Inject } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { shell } from 'electron'

import { IPCHandleNames } from '../../../shared/constants'
import { type FolderPathDto } from '../../../shared/dtos/filesystem.dto'
import { FilesystemService } from './filesystem.service'

@Controller()
export class FilesystemController {
  constructor(@Inject(FilesystemService) private readonly _filesystemService: FilesystemService) {}

  @IpcHandle(IPCHandleNames.OpenFolder)
  public async handleOpenFolder(@Payload() { path }: FolderPathDto): Promise<string> {
    return shell.openPath(path)
  }

  @IpcHandle(IPCHandleNames.RemoveFolder)
  public async handleRemoveFolder(@Payload() { path }: FolderPathDto): Promise<void> {
    return this._filesystemService.removeFolder(path)
  }
}
