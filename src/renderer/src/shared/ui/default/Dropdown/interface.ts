import { DropdownProps } from 'primereact/dropdown'
import { PropsWithoutRef } from 'react'

export interface DropdownFieldProps extends PropsWithoutRef<DropdownProps> {
  label?: string
  error?: string
}
