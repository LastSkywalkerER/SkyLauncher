import { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const HomeLayout: FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}
