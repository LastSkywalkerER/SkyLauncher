import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import {
  FilePickerOptions,
  FilePickerResult,
  FolderPathDto
} from '../../../../shared/dtos/filesystem.dto'

export interface IFeatureService {
  openFolder(version: FolderPathDto): Observable<string>
  removeFolder({ path }: FolderPathDto): Observable<void>
  showFilePickerDialog(options: FilePickerOptions): Observable<FilePickerResult>
}

export namespace IFeatureService {
  export const $: interfaces.ServiceIdentifier<IFeatureService> = Symbol('IFeatureService')
}
