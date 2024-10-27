import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { MegaMenu } from 'primereact/megamenu'
import { MenuItem } from 'primereact/menuitem'
import { Ripple } from 'primereact/ripple'
import { useNavigate } from 'react-router-dom'

import icon from '../../../../../resources/icons/icon.png'
import { ISettings } from '../../entities/Settings/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { routeLinks } from '../../shared/routes/routeNames'

export const Topbar = () => {
  const navigate = useNavigate()
  const { getSettings } = useInjection(ISettings.$)
  const settings = useObservable(getSettings(), null)

  const itemRenderer = (item) => {
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

  const items: MenuItem[] = routeLinks.map(({ name, path }) => ({
    label: name,
    template: itemRenderer,
    command() {
      navigate(path)
    }
  }))

  const start = () => {
    return (
      <div className={'flex items-center gap-5 mr-5'}>
        <Avatar template={<img src={icon} alt="icon" />} shape="circle" />
        <h3>{settings?.userName}</h3>
      </div>
    )
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
