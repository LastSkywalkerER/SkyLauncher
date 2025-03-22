import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { RouteNames } from '../../app/routes/routeNames'
import { IUser } from '../../entities/User/interfaces'
import { LoginData, LoginResponse } from '../../shared/api/BackendApi/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { InputFieldControlled } from '../../shared/ui/InputField'
import { PasswordFieldControlled } from '../../shared/ui/InputField/Password'
import { Loading } from '../../shared/ui/Loading'

const LoginForm: FC = () => {
  const { login, data$, isLoaded$ } = useInjection(IUser.$)
  const {
    execute: executeLogin,
    isLoading,
    isLoaded,
    error
  } = useObservableRequest<[LoginData], LoginResponse>(login)
  const userData = useObservable(data$, null)
  const isUserLoaded = useObservable(isLoaded$, false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginData>()

  useEffect(() => {
    userData?.email && setValue('email', userData?.email)
  }, [userData?.email])

  const onSubmit: SubmitHandler<LoginData> = (data) => executeLogin(data)

  if (isLoaded && !error) {
    return <Navigate to={RouteNames.CheckMinecraftProfile} />
  }

  if (isUserLoaded && userData?.userName) {
    return <Navigate to={RouteNames.CheckMinecraftProfile} />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={'relative h-full flex flex-col items-center justify-center gap-10'}
    >
      <div className="flex flex-col gap-10 p-10 bg-[var(--surface-100)] bg-opacity-90 rounded-2xl w-fit">
        <InputFieldControlled
          className={'w-full'}
          control={control}
          name={'email'}
          error={errors['email'] ? 'Field is required' : undefined}
          rules={{ required: true }}
        />
        <PasswordFieldControlled
          className={'w-full'}
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
