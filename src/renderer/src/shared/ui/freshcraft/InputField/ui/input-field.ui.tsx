import cx from 'classnames'
import { InputText } from 'primereact/inputtext'
import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { FCInputFieldProps } from '../interfaces'

export const FCInputFieldRenderer: ForwardRefRenderFunction<HTMLInputElement, FCInputFieldProps> = (
  {
    label,
    error,
    className,
    inputClassName,
    value = '',
    withLabel = true,
    afterInputComponent,
    ...props
  },
  ref
) => {
  return (
    <div className={cx('flex flex-col', className)}>
      {withLabel && (
        <label htmlFor={label} className="w-min text-xs uppercase font-bold mb-1">
          {label}
        </label>
      )}
      <div className={'w-full h-[34px] flex items-center'}>
        <InputText
          className={cx(
            'w-full h-full border-primary-base border-2 py-2 text-xs bg-common-darker !placeholder-contrast-base focus:border-white',
            inputClassName
          )}
          id={label}
          ref={ref}
          value={value}
          {...props}
          invalid={!!error}
        />
        {afterInputComponent}
      </div>
      <span className={'text-red-600'}>{error}</span>
    </div>
  )
}

export const FCInputField = forwardRef(FCInputFieldRenderer)

export const FCInputFieldControlled = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  control,
  defaultValue,
  // disabled,
  rules,
  shouldUnregister,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & FCInputFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      // disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FCInputField {...props} {...field} label={label || capitalizeFirstLetter(name)} />
      )}
    />
  )
}
