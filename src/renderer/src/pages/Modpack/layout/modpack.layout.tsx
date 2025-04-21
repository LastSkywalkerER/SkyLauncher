import { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const ModpackLayout: FC<{ Topbar: FC }> = ({ Topbar }) => {
  return (
    <>
      <Topbar />
      <main className="bg-common-lighter w-full h-[calc(100%-81px)]">
        <Outlet />
      </main>
    </>
  )
}
