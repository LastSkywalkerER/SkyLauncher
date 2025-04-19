import { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const HomeLayout: FC<{ Sidebar: FC }> = ({ Sidebar }) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 h-full overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 w-full h-full">
        <Outlet />
      </div>
    </div>
  )
}
