import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { FC } from 'react'

import { MenuItemTemplate } from './MenuItemTemplate'
import { Profile } from './Profile'

// Top fixed items
const topMenuItems: MenuItem[] = [
  {
    template: <Profile />
  },
  {
    label: 'Home',
    className: 'w-full text-main cube-border',
    icon: 'pi pi-fw pi-home text-2xl focus:active-cube-border'
  }
]

// Scrollable items
const scrollableMenuItems: MenuItem[] = [
  {
    label: 'Premium',
    className: 'text-yellow-500 cube-border',
    items: [
      {
        template: <MenuItemTemplate title="FreshCraft" subtitle="Vanilla" icon="pi pi-fw pi-home" />
      },
      {
        template: (
          <MenuItemTemplate title="FreshCraft" subtitle="Fantasy" icon="pi pi-fw pi-server" />
        )
      },
      {
        template: (
          <MenuItemTemplate title="FreshCraft" subtitle="Indastrial" icon="pi pi-fw pi-cloud" />
        )
      }
    ]
  },
  {
    label: 'Free',
    className: 'text-blue-400 cube-border',
    items: [
      {
        template: <MenuItemTemplate title="FreshCraft" subtitle="Vanilla" icon="pi pi-fw pi-list" />
      },
      {
        template: <MenuItemTemplate title="FreshCraft" subtitle="Fantasy" icon="pi pi-fw pi-list" />
      },
      {
        template: (
          <MenuItemTemplate title="FreshCraft" subtitle="Industrial" icon="pi pi-fw pi-list" />
        )
      }
    ]
  }
]

// Bottom fixed items
const bottomMenuItems: MenuItem[] = [
  {
    label: 'Settings',
    className: 'w-full text-main cube-border',
    icon: 'pi pi-fw pi-cog text-2xl'
  }
]

export const MCSidebar: FC = () => {
  return (
    <div className="w-full h-full bg-common-base border-r-2 border-common-darker flex flex-col">
      {/* Fixed top section */}

      <Menu model={topMenuItems} className="w-full p-0 border-none" />

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto">
        <Menu model={scrollableMenuItems} className="w-full p-0 border-none" />
      </div>

      {/* Fixed bottom section */}
      <Menu model={bottomMenuItems} className="w-full p-0 border-none" />
    </div>
  )
}
