import { Button } from 'primereact/button'
import { FC, MouseEventHandler } from 'react'

import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { IFeatureService } from '../../service/index'
import { OpenFolderProps } from './interface'

export const OpenButton: FC<OpenFolderProps> = ({ path, ...props }) => {
  const { openFolder } = useTransientInjection(IFeatureService.$)
  const { execute: executeOpenFolder } = useObservableRequest(openFolder)
  const handleOpenFolder: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()

    executeOpenFolder({ path })
  }

  return (
    <Button
      icon="pi pi-folder-open"
      rounded
      aria-label="Filter"
      onClick={handleOpenFolder}
      {...props}
    />
  )
}
