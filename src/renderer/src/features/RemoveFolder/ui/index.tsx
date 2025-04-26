import { Button } from 'primereact/button'
import { FC, MouseEventHandler } from 'react'

import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { IFeatureService } from '../../service/index'
import { RemoveFolderProps } from './interface'

export const RemoveButton: FC<RemoveFolderProps> = ({ path, CutomButton = Button, ...props }) => {
  const { removeFolder } = useTransientInjection(IFeatureService.$)
  const { execute: executeRemoveFolder } = useObservableRequest(removeFolder, [{ path }])

  const handleRemoveFolder: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    executeRemoveFolder({ path })
  }

  return (
    <CutomButton
      icon="pi pi-trash"
      rounded
      severity="danger"
      aria-label="Cancel"
      onClick={handleRemoveFolder}
      {...props}
    />
  )
}
