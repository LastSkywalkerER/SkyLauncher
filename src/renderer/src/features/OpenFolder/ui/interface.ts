import { ButtonProps } from 'primereact/button'

import { FolderPathDto } from '../../../../../shared/dtos/filesystem.dto'

export interface OpenFolderProps extends FolderPathDto, ButtonProps {}
