import { Button } from 'primereact/button'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { RouteNames } from '../../app/routes/routeNames'
import { IUser, UserData } from '../../entities/User/interfaces'
import { useLoadableState } from '../../shared/hooks/useLoadableState'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { InputFieldControlled } from '../../shared/ui/InputField'
import { Loading } from '../../shared/ui/Loading'

const OfflineForm: FC = () => {
  const {
    data,
    isLoading,
    isLoaded,
    instance: { offlineLogin }
  } = useLoadableState<IUser, UserData>(IUser.$)
  const { execute: executeOfflineLogin } = useObservableRequest(offlineLogin)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UserData>()

  const onSubmit: SubmitHandler<UserData> = (data) => executeOfflineLogin(data)

  if (isLoaded && data?.userName) {
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
          name={'userName'}
          error={errors['userName'] ? 'Field is required' : undefined}
          rules={{ required: true }}
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className={'flex items-center gap-10'}>
          <Link to={RouteNames.Login}>
            <Button severity="secondary">Back</Button>
          </Link>
          <Button type="submit">Login</Button>
        </div>
      )}
    </form>
  )
}

export default OfflineForm
