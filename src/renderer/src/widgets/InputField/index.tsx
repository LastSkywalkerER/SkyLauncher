import { FloatLabel } from 'primereact/floatlabel'
import { InputText, InputTextProps } from 'primereact/inputtext'
import { FC, forwardRef, ForwardRefRenderFunction, PropsWithoutRef, RefAttributes } from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

export interface InputFieldProps
  extends PropsWithoutRef<InputTextProps & RefAttributes<HTMLInputElement>> {
  label?: string
  error?: string
}

export const InputFieldComponent: FC<InputFieldProps> = ({ label, error, ...props }) => {
  return (
    <FloatLabel>
      <InputText id={label} {...props} invalid={!!error} />
      <label htmlFor={label}>{label}</label>
      {error ?? <span className={'text-red-600'}>{error}</span>}
    </FloatLabel>
  )
}

export const InputFieldRenderer: ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (
  { label, error, ...props },
  ref
) => {
  return (
    <div className={'flex flex-col'}>
      <FloatLabel>
        <InputText id={label} ref={ref} {...props} invalid={!!error} />
        <label htmlFor={label}>{label}</label>
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
  error,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & InputFieldProps) => {
  return (
    <Controller
      {...props}
      render={({ field }) => <InputField {...field} label={label || props.name} error={error} />}
    />
  )
}
