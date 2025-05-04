import { InputTextProps } from 'primereact/inputtext'
import { PasswordProps } from 'primereact/password'
import { RefAttributes } from 'react'
import { PropsWithoutRef } from 'react'

import { BaseFieldProps } from '../../default/InputField/interfaces'

export interface FCBaseFieldProps extends BaseFieldProps {}

export interface FCInputFieldProps
  extends PropsWithoutRef<InputTextProps & RefAttributes<HTMLInputElement>>,
    FCBaseFieldProps {}

export interface FCPasswordFieldProps
  extends PropsWithoutRef<PasswordProps & RefAttributes<HTMLInputElement>>,
    FCBaseFieldProps {}
