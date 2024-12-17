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

import { capitalizeFirstLetter } from '../../shared/utils/capitalizeFirstLetter'

export interface InputFieldProps
  extends PropsWithoutRef<PasswordProps & RefAttributes<HTMLInputElement>> {
  label?: string
  error?: string
}

export const PasswordFieldComponent: FC<InputFieldProps> = ({ label, error, ...props }) => {
  return (
    <FloatLabel>
      <Password id={label} {...props} invalid={!!error} />
      <label htmlFor={label}>{label}</label>
      {error ?? <span className={'text-red-600'}>{error}</span>}
    </FloatLabel>
  )
}

export const PasswordFieldRenderer: ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (
  { label, error, ...props },
  ref
) => {
  return (
    <div className={'flex flex-col'}>
      <FloatLabel>
        <Password id={label} inputRef={ref} {...props} invalid={!!error} />
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
