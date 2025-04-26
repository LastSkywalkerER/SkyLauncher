import { InputTextProps } from 'primereact/inputtext'
import { PasswordProps } from 'primereact/password'
import { ReactElement, RefAttributes } from 'react'
import { PropsWithoutRef } from 'react'

export interface BaseFieldProps {
  label?: string
  error?: string
  inputClassName?: string
  withLabel?: boolean
  afterInputComponent?: ReactElement
}

export interface InputFieldProps
  extends PropsWithoutRef<InputTextProps & RefAttributes<HTMLInputElement>>,
    BaseFieldProps {}

export interface PasswordFieldProps
  extends PropsWithoutRef<PasswordProps & RefAttributes<HTMLInputElement>>,
    BaseFieldProps {}
