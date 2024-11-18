import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

import { IUser, UserData } from '../../entities/User/interfaces'
import { PageLoading } from '../../widgets/Loading'
import { useLoadableState } from '../hooks/useLoadableState'
import { RouteNames } from '../routes/routeNames'

export const AuthGuard: FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
  const { data, isLoading, isLoaded } = useLoadableState<IUser, UserData>(IUser.$)

  console.log({ data, isLoading, isLoaded })

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
    return <Navigate to={RouteNames.Login} />
  }

  return <div>Something went wrong</div>
}
