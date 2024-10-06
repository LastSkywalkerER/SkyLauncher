import { MegaMenu } from 'primereact/megamenu'
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem'
import { Ripple } from 'primereact/ripple'

import icon from '../../../../../resources/icon.png'
import { routeLinks } from '../../shared/routes/routeNames'
import { useNavigate } from 'react-router-dom'
import { Avatar } from 'primereact/avatar'

export const Topbar = () => {
  const navigate = useNavigate()

  const itemRenderer = (item, options) => {
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
    command(event: MenuItemCommandEvent) {
      navigate(path)
    }
  }))

  const start = () => {
    return (
      <div className={'flex items-center gap-5 mr-5'}>
        <Avatar template={<img src={icon} alt="icon" />} shape="circle" />
        <h5>Player</h5>
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
