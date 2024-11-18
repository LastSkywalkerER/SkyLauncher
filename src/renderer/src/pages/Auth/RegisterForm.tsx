import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { FC } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { RegisterData } from '../../entities/BackendApi/interfaces'
import { IUser } from '../../entities/User/interfaces'
import { InputFieldControlled } from '../../widgets/InputField'

const RegisterForm: FC = () => {
  const { register } = useInjection(IUser.$)

  const {
    control,

    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    defaultValues: {
      terms: true,
      email: 'maxdr1998@gmail.com',
      password: 'Test1234',
      confirmPassword: 'Test1234',
      userName: 'LastSkywalker'
    }
  })

  const onSubmit: SubmitHandler<RegisterData> = (data) => register(data)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={'p-1 h-full flex flex-col items-center justify-between'}
    >
      <div className="flex flex-col gap-10 p-10 bg-[var(--surface-100)] bg-opacity-90 rounded-2xl w-fit">
        <InputFieldControlled
          control={control}
          name={'userName'}
          error={errors['userName'] ? 'Field is required' : undefined}
        />
        <InputFieldControlled
          control={control}
          name={'email'}
          error={errors['email'] ? 'Field is required' : undefined}
        />
        <InputFieldControlled
          control={control}
          name={'password'}
          error={errors['password'] ? 'Field is required' : undefined}
        />
        <InputFieldControlled
          control={control}
          name={'confirmPassword'}
          error={errors['confirmPassword'] ? 'Field is required' : undefined}
        />
        <Controller
          name={'terms'}
          control={control}
          render={({ field: { value, ...rest } }) => (
            <div className="flex align-items-center">
              <Checkbox
                inputId={rest.name}
                value={rest.name}
                checked={value as boolean}
                {...rest}
              />
              <label htmlFor={rest.name} className="ml-2">
                {rest.name}
              </label>
            </div>
          )}
        />
      </div>

      <Button type="submit" className={'self-center'}>
        Register
      </Button>
    </form>
  )
}

export default RegisterForm
