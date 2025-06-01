import { FolderIcon, InputField } from '@renderer/shared/ui'
import { Button } from 'primereact/button'
import { MouseEventHandler, ReactElement } from 'react'
import { Controller, FieldPath, FieldValues } from 'react-hook-form'

import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { IFeatureService } from '../../service/index'
import { FSInputPickerProps } from './interface'

export const FSInputPicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  className,
  disabled = false,
  error,
  title,
  defaultPath,
  buttonLabel,
  filters,
  properties,
  CustomButton = Button,
  CustomInput = InputField
}: FSInputPickerProps<TFieldValues, TName>): ReactElement => {
  const { showFilePickerDialog } = useTransientInjection(IFeatureService.$)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const { execute: executeFilePickerDialog, isLoading: isFilePickerLoading } =
          useObservableRequest(showFilePickerDialog, undefined, {
            onSuccess: (result) => {
              if (result && !result.canceled && result.filePaths.length > 0) {
                const selectedPath = result.filePaths[0]
                onChange(selectedPath)
              }
            }
          })

        const handleSelectFile: MouseEventHandler<HTMLButtonElement> = (event) => {
          event.preventDefault()
          event.stopPropagation()

          executeFilePickerDialog({
            title,
            defaultPath: defaultPath || value,
            buttonLabel,
            filters,
            properties: properties || ['openFile']
          })
        }

        return (
          <div className={`flex flex-col w-full h-full ${className || ''}`}>
            {label && <label className="w-min text-xs uppercase font-bold mb-1">{label}</label>}
            <div className="flex w-full items-center">
              <CustomInput
                value={value || ''}
                placeholder={placeholder}
                disabled
                className="!rounded-r-none w-full"
                afterInputComponent={
                  <CustomButton
                    rounded
                    aria-label="select-file"
                    onClick={handleSelectFile}
                    loading={isFilePickerLoading}
                    disabled={disabled || isFilePickerLoading}
                    className="rounded-l-none rounded-r-md p-1"
                  >
                    <FolderIcon />
                  </CustomButton>
                }
              />
            </div>
            {error && <small className="text-red-600 mt-1">{error}</small>}
          </div>
        )
      }}
    />
  )
}
