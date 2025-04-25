import { environment } from '@renderer/app/config/environments'
import cx from 'classnames'
import { FloatLabel } from 'primereact/floatlabel'
import { Password } from 'primereact/password'
import { FC, forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { ModpackProvider } from '../../../../../../shared/constants'
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter'
import { PasswordFieldProps } from '../interfaces'

export const PasswordFieldComponent: FC<PasswordFieldProps> = ({
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

export const PasswordFieldRenderer: ForwardRefRenderFunction<
  HTMLInputElement,
  PasswordFieldProps
> = (
  {
    label,
    error,
    className,
    value = '',
    isLabelFloat = environment.uiType !== ModpackProvider.FreshCraft,
    uiType = environment.uiType || 'default',
    inputClassName,
    ...props
  },
  ref
) => {
  return (
    <div className={cx('flex flex-col', className)}>
      {!isLabelFloat && (
        <label htmlFor={label} className="w-min text-xs uppercase font-bold mb-1">
          {label}
        </label>
      )}
      <FloatLabel className={'w-full h-full'}>
        <Password
          className={cx(
            'w-full h-full [&>div]:w-full [&>div]:h-full [&>div>span]:flex [&>div>span]:items-center [&>div>span]:justify-center'
          )}
          pt={{
            input: {
              className: cx(
                'w-full h-full',
                {
                  'border-primary-base border-2 py-2 text-xs bg-common-darker !placeholder-contrast-base focus:border-white':
                    uiType === ModpackProvider.FreshCraft
                },
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
        {isLabelFloat && <label htmlFor={label}>{label}</label>}
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
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & PasswordFieldProps): ReactNode => {
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
