import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { FC } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { environment } from '../../app/config/environments'
import { RouteNames } from '../../app/routes/routeNames'
import { IUser } from '../../entities/User/interfaces'
import { LoginResponse, RegisterData } from '../../shared/api/BackendApi/interfaces'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { InputFieldControlled } from '../../shared/ui/default/InputField'
import { PasswordFieldControlled } from '../../shared/ui/default/InputField/ui/password-field.ui'
import { Loading } from '../../shared/ui/default/Loading'

const RegisterForm: FC = () => {
  const { register } = useInjection(IUser.$)
  const {
    execute: executeRegister,
    isLoading,
    isLoaded,
    error
  } = useObservableRequest<[RegisterData], LoginResponse>(register)

  const {
    control,

    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>()

  const onSubmit: SubmitHandler<RegisterData> = (data) => executeRegister(data)

  if (isLoaded && !error) {
    return <Navigate to={RouteNames.CheckMinecraftProfile} />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={'relative h-full flex flex-col items-center justify-center gap-10'}
    >
      <div className="flex flex-col gap-10 p-10 bg-[var(--surface-100)] bg-opacity-90 rounded-2xl w-fit">
        <InputFieldControlled
          control={control}
          name={'email'}
          error={errors['email'] ? 'Field is required' : undefined}
          rules={{ required: true }}
        />
        <PasswordFieldControlled
          control={control}
          name={'password'}
          toggleMask
          error={errors['password'] ? 'Field is required' : undefined}
          rules={{ required: true }}
        />
        <PasswordFieldControlled
          control={control}
          name={'confirmPassword'}
          toggleMask
          error={errors['confirmPassword'] ? 'Field is required' : undefined}
          rules={{ required: true }}
        />

        <Controller
          name={'terms'}
          control={control}
          rules={{
            required: true
          }}
          render={({ field: { value, ...rest } }) => (
            <div className="flex align-items-center">
              <Checkbox
                inputId={rest.name}
                value={rest.name}
                checked={value as boolean}
                {...rest}
              />
              <p className="ml-2">
                I agree with{' '}
                <a
                  className={'underline cursor-pointer'}
                  target={'_blank'}
                  href={environment.termsLink}
                  rel="noreferrer"
                >
                  terms
                </a>
              </p>
            </div>
          )}
        />
        <p>
          Have an account?{' '}
          <Link className={'underline cursor-pointer'} to={RouteNames.Login}>
            Sign in
          </Link>
        </p>
        {error && <p className={'text-red-600'}>{error.message}</p>}
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className={'flex items-center gap-10'}>
          <Link to={RouteNames.OfflineLogin}>
            <Button severity="secondary">Go offline</Button>
          </Link>
          <Button type="submit">Register</Button>
        </div>
      )}
    </form>
  )
}

export default RegisterForm
