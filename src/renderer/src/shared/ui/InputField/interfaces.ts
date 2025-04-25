import { InputTextProps } from 'primereact/inputtext'
import { PasswordProps } from 'primereact/password'
import { RefAttributes } from 'react'
import { PropsWithoutRef } from 'react'

import { UiType } from '../types'

export interface BaseFieldProps {
  label?: string
  error?: string
  inputClassName?: string
  isLabelFloat?: boolean
  uiType?: UiType
}

export interface InputFieldProps
  extends PropsWithoutRef<InputTextProps & RefAttributes<HTMLInputElement>>,
    BaseFieldProps {}

export interface PasswordFieldProps
  extends PropsWithoutRef<PasswordProps & RefAttributes<HTMLInputElement>>,
    BaseFieldProps {}
