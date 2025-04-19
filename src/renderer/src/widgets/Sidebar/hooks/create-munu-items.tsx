import { MenuItem } from 'primereact/menuitem'
import { ReactElement } from 'react'

import { MenuItemTemplate } from './ui/MenuItemTemplate'

interface ModpackItem {
  id: string
  icon: string | ReactElement
  title: string
  subtitle: string
}

export const createMenuItem = (
  item: ModpackItem,
  activeItemId: string,
  handleItemClick: (id: string) => void
): MenuItem => ({
  id: item.id,
  icon: item.icon,
  data: {
    title: item.title,
    subtitle: item.subtitle,
    active: activeItemId === item.id
  },
  command: () => handleItemClick(item.id),
  template: (item, options) => (
    <MenuItemTemplate
      icon={item.icon}
      label={item.label}
      title={item.data?.title}
      subtitle={item.data?.subtitle}
      className={item.className}
      active={item.data?.active}
      onClick={options.onClick}
    />
  )
})
