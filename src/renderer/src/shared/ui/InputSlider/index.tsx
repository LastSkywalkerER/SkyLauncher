import cx from 'classnames'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Slider, SliderProps } from 'primereact/slider'
import { forwardRef, ForwardRefRenderFunction, PropsWithoutRef, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

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

// ✅ Component
export const SliderInputFieldComponent: ForwardRefRenderFunction<Slider, SliderInputFieldProps> = (
  {
    label,
    error,
    value = 0,
    onChange,
    showInput = true,
    inputStep = 1,
    min = 0,
    max = 100,
    disabled,
    ...props
  },
  ref
) => {
  return (
    <div className="flex flex-col gap-2">
      <FloatLabel>
        <label htmlFor={label}>{label}</label>

        <div className="flex flex-col">
          {showInput && (
            <InputText
              value={String(value)}
              onChange={(e) => {
                const numeric = Number(e.target.value)
                if (!isNaN(numeric)) onChange?.(numeric)
              }}
              step={inputStep}
              disabled={disabled}
            />
          )}
          <Slider
            id={label}
            value={value}
            onChange={(e) => onChange?.(e.value as number)}
            min={min}
            max={max}
            disabled={disabled}
            {...props}
            ref={ref} // ✅ ref → Slider instance
            className={cx({ 'p-invalid': !!error })}
          />
        </div>
      </FloatLabel>

      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  )
}

// ✅ Renderer с типом Slider
export const SliderInputField = forwardRef<Slider, SliderInputFieldProps>(SliderInputFieldComponent)

// ✅ Controlled
export const SliderInputFieldControlled = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  control,
  defaultValue,
  disabled,
  rules,
  shouldUnregister,
  error,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & SliderInputFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <SliderInputField
          {...props}
          label={label || capitalizeFirstLetter(name)}
          value={field.value}
          onChange={field.onChange}
          error={error}
        />
      )}
    />
  )
}
