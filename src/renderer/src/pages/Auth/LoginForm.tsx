import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { LoginData } from '../../entities/BackendApi/interfaces'
import { IUser } from '../../entities/User/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { RouteNames } from '../../shared/routes/routeNames'
import { InputFieldControlled } from '../../widgets/InputField'
import { Loading } from '../../widgets/Loading'

const LoginForm: FC = () => {
  const { login, isLoading$ } = useInjection(IUser.$)
  const isLoading = useObservable(isLoading$, false)
  const navigate = useNavigate()

  const {
    control,

    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>()

  const onSubmit: SubmitHandler<LoginData> = (data) =>
    login(data).then(() => navigate(RouteNames.Home))

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={'p-1 h-full flex flex-col items-center justify-between'}
    >
      <div className="flex flex-col gap-10 p-10 bg-[var(--surface-100)] bg-opacity-90 rounded-2xl w-fit">
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
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Button type="submit" className={'self-center'}>
          Login
        </Button>
      )}
    </form>
  )
}

export default LoginForm
