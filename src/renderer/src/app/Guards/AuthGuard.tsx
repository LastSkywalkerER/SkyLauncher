import { FC, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

import { IUser, UserData } from '../../entities/User/interfaces'
import { useLoadableState } from '../../shared/hooks/useLoadableState'
import { LoadingOverlay } from '../../shared/ui'
import { RouteNames } from '../routes/routeNames'

export const AuthGuard: FC<{
  children: ReactElement | ReactElement[]
  fallbackRoute?: RouteNames
}> = ({ children, fallbackRoute = RouteNames.Login }) => {
  const { data, isLoading, isLoaded } = useLoadableState<IUser, UserData>(IUser.$)
  const { t } = useTranslation()

  if (!isLoaded || isLoading) {
    return (
      <div className={'w-full h-full'}>
        <LoadingOverlay />
      </div>
    )
  }

  if (isLoaded && data?.role) {
    return children
  }

  if (isLoaded && !data?.role) {
    return <Navigate to={fallbackRoute} />
  }

  return <div>{t('common.error')}</div>
}
