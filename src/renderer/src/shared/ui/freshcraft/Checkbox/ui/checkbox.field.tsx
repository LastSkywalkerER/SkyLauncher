import { Checkbox } from 'primereact/checkbox'
import { FC, forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { FCCheckboxFieldProps } from '../interface'

export const FCCheckboxFieldComponent: FC<FCCheckboxFieldProps> = ({
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
          pt={{ box: { className: checked ? 'bg-primary-base border-primary-base' : '' } }}
          {...props}
        />
        {label && <label htmlFor={label}>{label}</label>}
      </div>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  )
}

// ✅ Renderer: передаём ref → inputRef в Checkbox
export const FCCheckboxFieldRenderer: ForwardRefRenderFunction<
  HTMLInputElement,
  FCCheckboxFieldProps
> = ({ label, error, checked, onChange, ...props }, ref) => {
  return (
    <FCCheckboxFieldComponent
      {...props}
      label={label}
      error={error}
      checked={checked}
      onChange={onChange}
      inputRef={ref}
    />
  )
}

export const FCCheckboxField = forwardRef(FCCheckboxFieldRenderer)

// ✅ Controlled
export const FCCheckboxFieldControlled = <
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
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & FCCheckboxFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FCCheckboxField
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
