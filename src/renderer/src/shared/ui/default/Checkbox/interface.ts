import { CheckboxProps } from 'primereact/checkbox'
import { PropsWithoutRef, RefAttributes } from 'react'

export interface CheckboxFieldProps
  extends PropsWithoutRef<
    Omit<CheckboxProps, 'onChange' | 'checked'> & RefAttributes<HTMLInputElement>
  > {
  label?: string
  error?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}
