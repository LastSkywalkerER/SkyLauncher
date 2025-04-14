import { MenuItem } from 'primereact/menuitem'
import { TabMenu } from 'primereact/tabmenu'
import { FC } from 'react'

const topMenuItems: MenuItem[] = [
  {
    label: 'Overview',
    icon: 'pi pi-fw pi-home'
  },
  {
    label: 'Servers',
    icon: 'pi pi-fw pi-server'
  },
  {
    label: 'Backups',
    icon: 'pi pi-fw pi-cloud'
  },
  {
    label: 'Settings',
    icon: 'pi pi-fw pi-cog'
  }
]

export const MCTopbar: FC = () => {
  return <TabMenu model={topMenuItems} className="w-full h-20 bg-common-base" />
}
