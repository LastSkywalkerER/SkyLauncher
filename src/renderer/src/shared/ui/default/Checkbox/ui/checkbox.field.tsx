// ✅ Component
import { Checkbox } from 'primereact/checkbox'
import { FC, forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { CheckboxFieldProps } from '../interface'

export const CheckboxFieldComponent: FC<CheckboxFieldProps> = ({
  label,
  error,
  checked = false,
  onChange,
  disabled,
  inputRef,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Checkbox
          inputId={label}
          checked={checked}
          onChange={(e) => onChange?.(e.checked ?? false)}
          disabled={disabled}
          inputRef={inputRef}
          {...props}
        />
        {label && <label htmlFor={label}>{label}</label>}
      </div>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  )
}

// ✅ Renderer: передаём ref → inputRef в Checkbox
export const CheckboxFieldRenderer: ForwardRefRenderFunction<
  HTMLInputElement,
  CheckboxFieldProps
> = ({ label, error, checked, onChange, ...props }, ref) => {
  return (
    <CheckboxFieldComponent
      {...props}
      label={label}
      error={error}
      checked={checked}
      onChange={onChange}
      inputRef={ref}
    />
  )
}

export const CheckboxField = forwardRef(CheckboxFieldRenderer)

// ✅ Controlled
export const CheckboxFieldControlled = <
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
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & CheckboxFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <CheckboxField
          {...props}
          label={label || capitalizeFirstLetter(name)}
          checked={field.value}
          onChange={field.onChange}
          error={error}
        />
      )}
    />
  )
}
