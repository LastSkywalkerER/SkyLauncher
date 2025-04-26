import cx from 'classnames'
import { Password } from 'primereact/password'
import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { capitalizeFirstLetter } from '../../../../utils/capitalizeFirstLetter'
import { FCPasswordFieldProps } from '../interfaces'

export const FCPasswordFieldRenderer: ForwardRefRenderFunction<
  HTMLInputElement,
  FCPasswordFieldProps
> = ({ label, error, className, value = '', weakLabel = true, inputClassName, ...props }, ref) => {
  return (
    <div className={cx('flex flex-col', className)}>
      {weakLabel && (
        <label htmlFor={label} className="w-min text-xs uppercase font-bold mb-1">
          {label}
        </label>
      )}
      <div className={'w-full h-[34px]'}>
        <Password
          className={cx(
            'w-full h-full [&>div]:w-full [&>div]:h-full [&>div>span]:flex [&>div>span]:items-center [&>div>span]:justify-center'
          )}
          pt={{
            input: {
              className: cx(
                'w-full h-full border-primary-base border-2 py-2 text-xs bg-common-darker !placeholder-contrast-base focus:border-white',
                inputClassName
              )
            }
          }}
          id={label}
          inputRef={ref}
          feedback={false}
          value={value}
          {...props}
          invalid={!!error}
        />
      </div>
      <span className={'text-red-600'}>{error}</span>
    </div>
  )
}

export const FCPasswordField = forwardRef(FCPasswordFieldRenderer)

export const FCPasswordFieldControlled = <
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
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & FCPasswordFieldProps): ReactNode => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FCPasswordField {...props} {...field} label={label || capitalizeFirstLetter(name)} />
      )}
    />
  )
}
