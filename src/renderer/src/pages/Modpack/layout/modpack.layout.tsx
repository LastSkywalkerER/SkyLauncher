import { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const ModpackLayout: FC<{ Topbar: FC }> = ({ Topbar }) => {
  return (
    <>
      <Topbar />
      <main className="h-full w-full bg-common-lighter overflow-x-auto">
        <Outlet />
      </main>
    </>
  )
}
