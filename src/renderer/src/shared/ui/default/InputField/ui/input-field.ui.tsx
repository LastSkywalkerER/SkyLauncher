import cx from 'classnames'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { FC, forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { InputFieldProps } from '../interfaces'

export const InputFieldComponent: FC<InputFieldProps> = ({ label, error, className, ...props }) => {
  return (
    <FloatLabel className={cx('flex flex-col', className)}>
      <InputText className={'w-full h-full'} id={label} {...props} invalid={!!error} />
      <label htmlFor={label}>{label}</label>
      {error ?? <span className={'text-red-600'}>{error}</span>}
    </FloatLabel>
  )
}

export const InputFieldRenderer: ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (
  {
    label,
    error,
    className,
    inputClassName,
    withLabel = true,
    value = '',
    afterInputComponent,
    ...props
  },
  ref
) => {
  return (
    <div className={cx('flex flex-col', className)}>
      <FloatLabel className={'w-full h-full flex items-center'}>
        <InputText
          className={cx('w-full h-full', inputClassName)}
          id={label}
          ref={ref}
          value={value}
          {...props}
          invalid={!!error}
        />
        {afterInputComponent}
        {withLabel && <label htmlFor={label}>{label}</label>}
      </FloatLabel>
      <span className={'text-red-600'}>{error}</span>
    </div>
  )
}

export const InputField = forwardRef(InputFieldRenderer)

export const InputFieldControlled = <
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
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & InputFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <InputField {...props} {...field} label={label || capitalizeFirstLetter(name)} />
      )}
    />
  )
}
