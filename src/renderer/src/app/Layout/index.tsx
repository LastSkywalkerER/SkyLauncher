import { useInjection } from 'inversify-react'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { ProgressBar } from '../../widgets/ProgressBar'
import { Topbar } from '../../widgets/Topbar'
import { Dock } from '../../widgets/Versions'
import background from '../../../../../resources/images/splash_screen.png'

const Layout: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const version = useObservable(getCurrentMCVersion(), null)

  return (
    <div className="h-screen">
      <img
        className={'absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover'}
        src={version?.coverImage || background}
        alt="splash"
      />

      <Topbar />
      <Dock />
      <div className={'absolute top-[90px] right-0 left-[100px] h-[80%]'}>
        <Outlet />
      </div>
      <ProgressBar className={'absolute bottom-0 w-full'} />
    </div>
  )
}

export default Layout
