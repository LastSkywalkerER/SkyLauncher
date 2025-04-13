import cx from 'classnames'
import { FloatLabel } from 'primereact/floatlabel'
import { Password, PasswordProps } from 'primereact/password'
import {
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithoutRef,
  ReactNode,
  RefAttributes
} from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

export interface InputFieldProps
  extends PropsWithoutRef<PasswordProps & RefAttributes<HTMLInputElement>> {
  label?: string
  error?: string
}

export const PasswordFieldComponent: FC<InputFieldProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <FloatLabel className={cx('flex flex-col', className)}>
      <Password className={'w-full h-full'} id={label} {...props} invalid={!!error} />
      <label htmlFor={label}>{label}</label>
      {error ?? <span className={'text-red-600'}>{error}</span>}
    </FloatLabel>
  )
}

export const PasswordFieldRenderer: ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (
  { label, error, className, value = '', ...props },
  ref
) => {
  return (
    <div className={cx('flex flex-col', className)}>
      <FloatLabel className={'w-full h-full'}>
        <Password
          className={
            'w-full h-full [&>div]:w-full [&>div]:h-full [&>div>span]:flex [&>div>span]:items-center [&>div>span]:justify-center'
          }
          inputClassName={'w-full h-full'}
          id={label}
          inputRef={ref}
          feedback={false}
          value={value}
          {...props}
          invalid={!!error}
        />
        <label htmlFor={label}>{label}</label>
      </FloatLabel>
      <span className={'text-red-600'}>{error}</span>
    </div>
  )
}

export const PasswordField = forwardRef(PasswordFieldRenderer)

export const PasswordFieldControlled = <
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
        <PasswordField {...props} {...field} label={label || capitalizeFirstLetter(name)} />
      )}
    />
  )
}
