import { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const HomeLayout: FC<{ Sidebar: FC; Topbar: FC }> = ({ Sidebar, Topbar }) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 h-full">
        <Sidebar />
      </div>

      <div className="flex-1 w-full h-full">
        <Topbar />
        <main className="bg-common-lighter w-full h-[calc(100%-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
