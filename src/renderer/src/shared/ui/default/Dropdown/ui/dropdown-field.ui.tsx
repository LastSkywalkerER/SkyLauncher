import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { FC, forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { DropdownFieldProps } from '../interface'

// ✅ Component без ref
export const DropdownFieldComponent: FC<DropdownFieldProps> = ({
  label,
  error,
  ...props
}: DropdownFieldProps) => {
  return (
    <FloatLabel>
      <Dropdown id={label} {...props} className={error ? 'p-invalid' : ''} />
      <label htmlFor={label}>{label}</label>
      {error && <span className="text-red-600">{error}</span>}
    </FloatLabel>
  )
}

// ✅ Renderer: тип ref должен быть Dropdown, не HTMLSelectElement
export const DropdownFieldRenderer: ForwardRefRenderFunction<Dropdown, DropdownFieldProps> = (
  { label, error, ...props },
  ref
) => {
  return (
    <div className="flex flex-col">
      <FloatLabel>
        <Dropdown
          id={label}
          ref={ref} // 👈 передаём ref как Dropdown-класс
          {...props}
          className={error ? 'p-invalid' : ''}
        />
        <label htmlFor={label}>{label}</label>
      </FloatLabel>
      {error && <span className="text-red-600">{error}</span>}
    </div>
  )
}

// ✅ forwardRef указывает тип Dropdown
export const DropdownField = forwardRef<Dropdown, DropdownFieldProps>(DropdownFieldRenderer)

// ✅ Controlled версия
export const DropdownFieldControlled = <
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
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & DropdownFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <DropdownField
          {...props}
          {...field}
          label={label || capitalizeFirstLetter(name)}
          value={field.value}
          onChange={(e) => field.onChange(e.value)}
          error={error}
        />
      )}
    />
  )
}
