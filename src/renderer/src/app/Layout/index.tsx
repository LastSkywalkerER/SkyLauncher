import { Sidebar } from '@renderer/widgets/Sidebar'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

const Layout: FC = () => {
  return (
    <div className="h-screen">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default Layout
