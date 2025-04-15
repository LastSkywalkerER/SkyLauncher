import { MenuItem } from 'primereact/menuitem'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RouteNames } from '../../../app/routes/routeNames'
import { MenuItemTemplate } from './ui/MenuItemTemplate'
import { Profile } from './ui/Profile'

interface MenuItemsReturn {
  topMenuItems: MenuItem[]
  scrollableMenuItems: MenuItem[]
  bottomMenuItems: MenuItem[]
  activeItemId: string
}

interface ServerItem {
  id: string
  icon: string
  title: string
  subtitle: string
}

const createMenuItem = (
  item: ServerItem,
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

export const useMenuItems = (): MenuItemsReturn => {
  const [activeItemId, setActiveItemId] = useState<string>('home')
  const navigate = useNavigate()

  const handleItemClick = (itemId: string): void => {
    setActiveItemId(itemId)

    if (itemId === 'home') {
      navigate(RouteNames.Home)
    } else if (itemId === 'settings') {
      navigate(RouteNames.Settings)
    } else {
      navigate(`${RouteNames.Modpack}/${itemId}`)
    }
  }

  // Top fixed items
  const topMenuItems: MenuItem[] = [
    {
      template: <Profile />
    },
    createMenuItem(
      {
        id: 'home',
        icon: 'pi pi-fw pi-home text-2xl',
        title: 'Home',
        subtitle: ''
      },
      activeItemId,
      handleItemClick
    )
  ]

  const premiumModpacks = [
    {
      type: 'vanilla',
      icon: 'pi pi-fw pi-box',
      title: 'FreshCraft'
    },
    {
      type: 'fantasy',
      icon: 'pi pi-fw pi-bolt',
      title: 'FreshCraft'
    },
    {
      type: 'industrial',
      icon: 'pi pi-fw pi-sitemap',
      title: 'FreshCraft'
    }
  ]

  const freeModpacks = [
    {
      type: 'vanilla',
      icon: 'pi pi-fw pi-th-large',
      title: 'FreshCraft'
    },
    {
      type: 'fantasy',
      icon: 'pi pi-fw pi-palette',
      title: 'FreshCraft'
    },
    {
      type: 'industrial',
      icon: 'pi pi-fw pi-sliders-h',
      title: 'FreshCraft'
    }
  ]

  const serverCategories = [
    {
      label: 'Premium',
      className: 'text-yellow-500 cube-border',
      icon: 'pi pi-fw pi-home',
      modpacks: premiumModpacks
    },
    {
      label: 'Free',
      className: 'text-blue-400 cube-border',
      icon: 'pi pi-fw pi-list',
      modpacks: freeModpacks
    }
  ]

  // Scrollable items
  const scrollableMenuItems: MenuItem[] = serverCategories.map((category) => ({
    label: category.label,
    className: category.className,
    items: category.modpacks.map((modpack) =>
      createMenuItem(
        {
          id: `${category.label.toLowerCase()}-${modpack.type}`,
          icon: modpack.icon,
          title: modpack.title,
          subtitle: modpack.type.charAt(0).toUpperCase() + modpack.type.slice(1)
        },
        activeItemId,
        handleItemClick
      )
    )
  }))

  // Bottom fixed items
  const bottomMenuItems: MenuItem[] = [
    createMenuItem(
      {
        id: 'settings',
        icon: 'pi pi-fw pi-cog text-2xl',
        title: 'Settings',
        subtitle: ''
      },
      activeItemId,
      handleItemClick
    )
  ]

  return {
    topMenuItems,
    scrollableMenuItems,
    bottomMenuItems,
    activeItemId
  }
}
