import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { ProgressBar } from '../../widgets/ProgressBar'
import { Topbar } from '../../widgets/Topbar'
import { Dock } from '../../widgets/Versions'

const Layout: FC = () => {
  return (
    <>
      <Topbar />
      <Dock />
      <div className={'absolute top-[90px] right-0 left-[100px] h-[80%]'}>
        <Outlet />
      </div>
      <ProgressBar className={'absolute bottom-0 w-full'} />
    </>
  )
}

export default Layout
