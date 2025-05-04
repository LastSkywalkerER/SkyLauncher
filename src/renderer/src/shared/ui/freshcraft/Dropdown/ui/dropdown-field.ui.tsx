import cx from 'classnames'
import { Dropdown } from 'primereact/dropdown'
import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { FCDropdownFieldProps } from '../interface'

// ✅ Renderer: тип ref должен быть Dropdown, не HTMLSelectElement
export const FCDropdownFieldRenderer: ForwardRefRenderFunction<Dropdown, FCDropdownFieldProps> = (
  { label, error, className, ...props },
  ref
) => {
  return (
    <div className="flex flex-col w-full h-full">
      <label htmlFor={label} className="w-min text-xs uppercase font-bold mb-1">
        {label}
      </label>

      <Dropdown
        id={label}
        ref={ref} // 👈 передаём ref как Dropdown-класс
        {...props}
        pt={{
          itemLabel: {
            className: 'text-xs p-0'
          },
          input: {
            className: 'text-xs py-0 px-3'
          }
        }}
        className={cx(
          'w-full h-[34px] border-primary-base border-2 flex items-center text-xs bg-common-darker !placeholder-contrast-base focus:border-white',
          { 'p-invalid': error },
          className
        )}
      />

      {error && <span className="text-red-600">{error}</span>}
    </div>
  )
}

// ✅ forwardRef указывает тип Dropdown
export const FCDropdownField = forwardRef<Dropdown, FCDropdownFieldProps>(FCDropdownFieldRenderer)

// ✅ Controlled версия
export const FCDropdownFieldControlled = <
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
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & FCDropdownFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FCDropdownField
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
