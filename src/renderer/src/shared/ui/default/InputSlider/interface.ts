import { SliderProps } from 'primereact/slider'
import { PropsWithoutRef } from 'react'

export interface SliderInputFieldProps
  extends PropsWithoutRef<Omit<SliderProps, 'onChange' | 'value'>> {
  label?: string
  error?: string
  value?: number
  onChange?: (value: number) => void
  showInput?: boolean
  inputStep?: number
  min?: number
  max?: number
}
