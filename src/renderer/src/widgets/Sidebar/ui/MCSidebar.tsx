import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { FC } from 'react'

import { Profile } from './Profile'

const sideMenuItems: MenuItem[] = [
  {
    template: <Profile />
  },
  {
    label: 'Premium',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        className: 'text-yellow-500'
      },
      {
        label: 'Servers',
        icon: 'pi pi-fw pi-server',
        className: 'text-yellow-500'
      },
      {
        label: 'Backups',
        icon: 'pi pi-fw pi-cloud',
        className: 'text-yellow-500'
      }
    ]
  },
  {
    label: 'Free',
    items: [
      {
        label: 'My Servers',
        icon: 'pi pi-fw pi-list',
        className: 'text-blue-400'
      },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
        className: 'text-blue-400'
      }
    ]
  }
]

export const MCSidebar: FC = () => {
  return <Menu model={sideMenuItems} className="w-full h-full bg-common-base" />
}
