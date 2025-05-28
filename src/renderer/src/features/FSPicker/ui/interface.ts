import { InputField } from '@renderer/shared/ui'
import { BaseFieldProps } from '@renderer/shared/ui/default/InputField/interfaces'
import { Button, ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { FilePickerOptions } from '../../../../../shared/dtos/filesystem.dto'

export interface FSPickerProps
  extends Omit<ButtonProps, 'onClick' | 'loading' | 'onChange'>,
    FilePickerOptions {
  value?: string
  onChange?: (filePath: string | null) => void
  placeholder?: string
  CustomButton?: FC<ButtonProps>
}

export interface FSInputPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends FilePickerOptions {
  control: ControllerProps<TFieldValues, TName>['control']
  name: TName
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: string
  CustomButton?: FC<ButtonProps> | typeof Button
  CustomInput?: FC<BaseFieldProps> | typeof InputField
}
