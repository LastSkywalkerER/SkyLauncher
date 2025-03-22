import { useInjection } from 'inversify-react'
import { FC, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import background from '../../../../../resources/images/splash_screen.png'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { PageLoading } from '../../shared/ui/Loading'

export const Background: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const version = useObservable(getCurrentMCVersion(), null)

  return (
    <div className="h-screen">
      <img
        className={'absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover'}
        src={version?.coverImage || background}
        alt="splash"
      />

      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </div>
  )
}
