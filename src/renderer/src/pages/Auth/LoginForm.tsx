import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { LoginData, LoginResponse } from '../../entities/BackendApi/interfaces'
import { IUser } from '../../entities/User/interfaces'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { RouteNames } from '../../shared/routes/routeNames'
import { InputFieldControlled } from '../../widgets/InputField'
import { PasswordFieldControlled } from '../../widgets/InputField/Password'
import { Loading } from '../../widgets/Loading'

const LoginForm: FC = () => {
  const { login } = useInjection(IUser.$)
  const {
    execute: executeLogin,
    isLoading,
    isLoaded,
    error
  } = useObservableRequest<[LoginData], LoginResponse>(login)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>()

  const onSubmit: SubmitHandler<LoginData> = (data) => executeLogin(data)

  if (isLoaded && !error) {
    return <Navigate to={RouteNames.Home} />
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
        <p>
          Have no account?{' '}
          <Link className={'underline cursor-pointer'} to={RouteNames.Register}>
            Sign up
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
          <Button type="submit">Login</Button>
        </div>
      )}
    </form>
  )
}

export default LoginForm
