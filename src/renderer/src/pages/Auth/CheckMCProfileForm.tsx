import { Button } from 'primereact/button'
import { FC, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { IUser, UserData } from '../../entities/User/interfaces'
import { environment } from '../../shared/config/environments'
import { useLoadableState } from '../../shared/hooks/useLoadableState'
import { useObservableRequest } from '../../shared/hooks/useObservableRequest'
import { RouteNames } from '../../shared/routes/routeNames'
import { Loading } from '../../widgets/Loading'

const CheckMCProfileForm: FC = () => {
  const {
    data,
    isLoading,
    isLoaded,
    instance: { getMinecraftProfile, logout },
    error
  } = useLoadableState<IUser, UserData>(IUser.$)
  const { execute: executeLogout } = useObservableRequest(logout)

  useEffect(() => {
    getMinecraftProfile()
  }, [])

  if (isLoaded && data?.userName) {
    return <Navigate to={RouteNames.Home} />
  }

  return (
    <div className={'relative h-full flex flex-col items-center justify-center gap-10'}>
      {error?.message && (
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
          </div>
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <div className={'flex items-center gap-10'}>
          <Link to={RouteNames.OfflineLogin}>
            <Button severity="secondary">Go offline</Button>
          </Link>
          <Link to={RouteNames.Login}>
            <Button className={'underline cursor-pointer'} onClick={executeLogout}>
              Logout
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default CheckMCProfileForm
