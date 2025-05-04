import { Button } from 'primereact/button'
import { Sidebar as PrimereactSidebar } from 'primereact/sidebar'
import { FC, useState } from 'react'
import { Link } from 'react-router-dom'

import { routeLinks } from '../../../app/routes/routes'

export const Sidebar: FC = () => {
  const [visible, setVisible] = useState(true)

  return (
    <>
      <PrimereactSidebar visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-col gap-5">
          {routeLinks.map(({ name, path }) => (
            <Link key={path} to={path}>
              {name}
            </Link>
          ))}
        </div>
      </PrimereactSidebar>
      <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
    </>
  )
}
