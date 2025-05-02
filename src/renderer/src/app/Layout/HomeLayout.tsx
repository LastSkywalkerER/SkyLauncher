import { NotificationCenter, SingleProgressBar } from '@renderer/widgets'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const HomeLayout: FC<{ Sidebar: FC }> = ({ Sidebar }) => {
  return (
    <div className="flex h-screen relative">
      <div className="w-64 h-full overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col w-full h-full">
        <Outlet />

        <NotificationCenter />
        <SingleProgressBar className="bg-common-base" />
      </div>
    </div>
  )
}
