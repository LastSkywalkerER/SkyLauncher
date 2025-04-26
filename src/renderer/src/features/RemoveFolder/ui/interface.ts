import { ButtonProps } from 'primereact/button'
import { FC } from 'react'

import { FolderPathDto } from '../../../../../shared/dtos/filesystem.dto'

export interface RemoveFolderProps extends FolderPathDto, ButtonProps {
  CutomButton?: FC<ButtonProps>
}
