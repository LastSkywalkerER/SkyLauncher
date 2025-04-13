import { Avatar } from 'primereact/avatar'
import { MegaMenu } from 'primereact/megamenu'
import { MenuItem } from 'primereact/menuitem'
import { Ripple } from 'primereact/ripple'
import { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { routeLinks } from '../../../app/routes/routes'
import { IUser, UserData } from '../../../entities/User/interfaces'
import { useLoadableState } from '../../../shared/hooks/useLoadableState'
import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'

export const Topbar: FC = () => {
  const navigate = useNavigate()
  const {
    data,
    instance: { logout }
  } = useLoadableState<IUser, UserData>(IUser.$)
  const { execute: executeLogout } = useObservableRequest(logout)

  if (!data) {
    return null
  }

  const itemRenderer = (item): ReactNode => {
    return (
      <a
        className="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative font-semibold text-lg uppercase p-ripple hover:surface-ground"
        style={{ borderRadius: '2rem' }}
      >
        <span className={item.icon} />
        <span className="ml-2">{item.label}</span>
        <Ripple />
      </a>
    )
  }

  const items: MenuItem[] = [
    ...routeLinks.map(({ name, path }) => ({
      label: name,
      template: itemRenderer,
      command(): void {
        navigate(path)
      }
    })),
    {
      label: 'Logout',
      command(): void {
        executeLogout()
      }
    }
  ]

  const start = (): ReactNode | null => {
    return data ? (
      <div className={'flex items-center gap-5 mr-5'}>
        <Avatar template={<img src={data.icon} alt="icon" />} shape="circle" />
        <h3>{data.userName || 'No MC Account'}</h3>
      </div>
    ) : null
  }

  return (
    <div className="card pt-5 mx-5 relative">
      <MegaMenu
        model={items}
        orientation="horizontal"
        start={start}
        className="p-3 surface-0 shadow-2"
        style={{ borderRadius: '3rem' }}
      />
    </div>
  )
}
