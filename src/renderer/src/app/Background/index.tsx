import { useInjection } from 'inversify-react'
import { FC, ReactElement, Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import background from '../../../../../resources/images/splash_screen.png'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { LoadingOverlay } from '../../shared/ui/default/Loading'

export const Background: FC<{ image?: string; children?: ReactElement | ReactElement[] }> = ({
  image,
  children
}) => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const version = useObservable(getCurrentMCVersion(), null)

  return (
    <div className="h-screen">
      <img
        className={'absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover'}
        src={image || version?.coverImage || background}
        alt="splash"
      />

      <div className="relative h-full">
        <Suspense fallback={<LoadingOverlay />}>{children || <Outlet />}</Suspense>
      </div>
    </div>
  )
}
