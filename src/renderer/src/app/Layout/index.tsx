import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from '../../widgets/Topbar'
import { Dock } from '../../widgets/Versions'
import splash from '../../../../../resources/splash_screen.png'

const Layout: FC = () => {
  return (
    <div className="h-screen">
      <img
        className={'absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover'}
        src={splash}
        alt="splash"
      />

      <Topbar />
      <Dock />
      <div className={'absolute top-[90px] right-0 left-[100px] h-[80%]'}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
