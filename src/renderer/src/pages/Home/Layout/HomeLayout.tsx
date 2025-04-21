import { ProgressBar } from '@renderer/widgets/ProgressBar'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const HomeLayout: FC<{ Sidebar: FC }> = ({ Sidebar }) => {
  return (
    <div className="flex h-screen relative">
      <div className="w-64 h-full overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 w-full h-full">
        <Outlet />
      </div>

      <ProgressBar className={'absolute bottom-0 w-full'} />
    </div>
  )
}
