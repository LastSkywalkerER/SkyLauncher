import cx from 'classnames'
import { InputText } from 'primereact/inputtext'
import { Slider } from 'primereact/slider'
import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { FCSliderInputFieldProps } from '../interface'

// ✅ Component
export const FCSliderInputFieldComponent: ForwardRefRenderFunction<
  Slider,
  FCSliderInputFieldProps
> = (
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
    <div className="flex flex-col w-full">
      <label htmlFor={label} className="w-min text-xs uppercase font-bold mb-1">
        {label}
      </label>

      <div className="h-[34px] w-full flex flex-col">
        {showInput && (
          <InputText
            value={String(value)}
            onChange={(e) => {
              const numeric = Number(e.target.value)
              if (!isNaN(numeric)) onChange?.(numeric)
            }}
            step={inputStep}
            disabled={disabled}
            className="h-full w-full border-primary-base border-2 py-2 text-xs bg-common-darker !placeholder-contrast-base focus:border-white rounded-b-none border-b-0"
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
          pt={{
            handle: { className: 'bg-primary-base' },
            range: { className: 'bg-primary-base' }
          }}
        />
      </div>

      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  )
}

// ✅ Renderer с типом Slider
export const FCSliderInputField = forwardRef<Slider, FCSliderInputFieldProps>(
  FCSliderInputFieldComponent
)

// ✅ Controlled
export const FCSliderInputFieldControlled = <
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
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & FCSliderInputFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FCSliderInputField
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
