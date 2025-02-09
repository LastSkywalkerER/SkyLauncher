import { Button } from 'primereact/button'
import { FC, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { IUser, UserData } from '../../entities/User/interfaces'
import { environment } from '../../shared/config/environments'
import { useLoadableState } from '../../shared/hooks/useLoadableState'
import { RouteNames } from '../../shared/routes/routeNames'
import { Loading } from '../../widgets/Loading'

const CheckMCProfileForm: FC = () => {
  const {
    data,
    isLoading,
    isLoaded,
    instance: { getMinecraftProfile },
    error
  } = useLoadableState<IUser, UserData>(IUser.$)

  useEffect(() => {
    getMinecraftProfile()
  }, [])

  if (isLoaded && data?.userName) {
    return <Navigate to={RouteNames.Home} />
  }

  return (
    <div className={'relative h-full flex flex-col items-center justify-center gap-10'}>
      <div className="flex flex-col gap-10 p-10 bg-[var(--surface-100)] bg-opacity-90 rounded-2xl w-fit">
        <p>{error?.message}</p>
        <div className={'flex justify-between'}>
          <a
            target={'_blank'}
            className={'underline cursor-pointer'}
            href={environment.xboxConnectionLink}
            rel="noreferrer"
          >
            Connect Xbox
          </a>
          <Link className={'underline cursor-pointer'} to={RouteNames.Login}>
            Try another account.
          </Link>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Link to={RouteNames.OfflineLogin}>
          <Button severity="secondary">Go offline</Button>
        </Link>
      )}
    </div>
  )
}

export default CheckMCProfileForm
