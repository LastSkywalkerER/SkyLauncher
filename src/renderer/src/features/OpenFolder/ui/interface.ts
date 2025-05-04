import { ButtonProps } from 'primereact/button'
import { FC } from 'react'

import { FolderPathDto } from '../../../../../shared/dtos/filesystem.dto'

export interface OpenFolderProps extends FolderPathDto, ButtonProps {
  CutomButton?: FC<ButtonProps>
}
