import { Button } from 'primereact/button'
import { FC, MouseEventHandler } from 'react'

import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { IFeatureService } from '../../service/index'
import { FSPickerProps } from './interface'

export const FSPicker: FC<FSPickerProps> = ({
  value,
  onChange,
  placeholder,
  CustomButton = Button,
  title,
  defaultPath,
  buttonLabel,
  filters,
  properties,
  ...buttonProps
}) => {
  const { showFilePickerDialog } = useTransientInjection(IFeatureService.$)
  const { execute: executeFilePickerDialog, isLoading } = useObservableRequest(
    showFilePickerDialog,
    undefined,
    {
      onSuccess: (result) => {
        if (result && !result.canceled && result.filePaths.length > 0) {
          const selectedPath = result.filePaths[0]
          onChange?.(selectedPath)
        }
      }
    }
  )

  const handleOpenDialog: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()

    executeFilePickerDialog({
      title,
      defaultPath: defaultPath || value,
      buttonLabel,
      filters,
      properties
    })
  }

  const displayText = value || placeholder

  return (
    <CustomButton
      icon="pi pi-folder-open"
      label={displayText}
      onClick={handleOpenDialog}
      loading={isLoading}
      {...buttonProps}
    />
  )
}
