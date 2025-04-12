import { FC, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

import { IUser, UserData } from '../../entities/User/interfaces'
import { useLoadableState } from '../../shared/hooks/useLoadableState'
import { PageLoading } from '../../shared/ui/index'
import { RouteNames } from '../routes/routeNames'

export const AuthGuard: FC<{
  children: ReactElement | ReactElement[]
  fallbackRoute?: RouteNames
}> = ({ children, fallbackRoute }) => {
  const { data, isLoading, isLoaded } = useLoadableState<IUser, UserData>(IUser.$)
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className={'w-full h-full'}>
        <PageLoading />
      </div>
    )
  }

  if (isLoaded && data) {
    return children
  }

  if (isLoaded && !data) {
    return <Navigate to={fallbackRoute || RouteNames.Login} />
  }

  return <div>{t('common.error')}</div>
}
