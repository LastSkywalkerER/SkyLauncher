import { RouteNames } from '@renderer/app/routes/routeNames'
import { IUser } from '@renderer/entities/User/interfaces'
import { GoBack } from '@renderer/features/GoBack/ui/GoBack'
import { AuthCard } from '@renderer/pages/Auth/ui/AuthCard'
import { LoginData, LoginResponse } from '@renderer/shared/api/BackendApi/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { useObservableRequest } from '@renderer/shared/hooks/useObservableRequest'
import { FCInputFieldControlled, FCPasswordFieldControlled } from '@renderer/shared/ui'
import { BigButton } from '@renderer/shared/ui/default/BigButton'
import { useInjection } from 'inversify-react'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

const Login: FC = () => {
  const { t } = useTranslation()
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
    return <Navigate to={RouteNames.Home} />
  }

  if (isUserLoaded && userData?.userName) {
    return <Navigate to={RouteNames.Home} />
  }

  return (
    <AuthCard className={'pb-0'}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'w-full h-full flex flex-col items-center justify-center gap-5'}
      >
        <FCInputFieldControlled
          className={'w-full'}
          control={control}
          name={'email'}
          label={t('common.email')}
          error={errors['email'] ? t('errors.required') : undefined}
          rules={{ required: true }}
        />
        <FCPasswordFieldControlled
          className={'w-full'}
          control={control}
          name={'password'}
          label={t('common.password')}
          toggleMask
          error={errors['password'] ? t('errors.required') : undefined}
          rules={{ required: true }}
        />

        {error && <p className={'text-red-600'}>{error.message}</p>}

        <BigButton type="submit" loading={isLoading}>
          {t('auth.login')}
        </BigButton>

        <GoBack />
      </form>
    </AuthCard>
  )
}

export default Login
