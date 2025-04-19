import { environment } from '@renderer/app/config/environments'
import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { MenuItem } from 'primereact/menuitem'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RouteNames } from '../../../app/routes/routeNames'
import { IVersions } from '../../../entities/Versions/interfaces'
import { useObservable } from '../../../shared/hooks/useObservable'
import { createMenuItem } from './create-munu-items'
import { Profile } from './ui/Profile'

interface MenuItemsReturn {
  topMenuItems: MenuItem[]
  scrollableMenuItems: MenuItem[]
  bottomMenuItems: MenuItem[]
  activeItemId: string
}

export const useMenuItems = (): MenuItemsReturn => {
  const { getCustomMCVersions, getCurseForgeModpacks } = useInjection(IVersions.$)
  const versions = useObservable(getCustomMCVersions(), [])
  const curseForgeModpacks = useObservable(getCurseForgeModpacks(), [])
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

  const premiumModpacks = versions
    .filter((version) => version.modpackProvider === environment.uiType)
    .map((version) => ({
      type: version.name,
      icon: <Avatar image={version.icon} shape="square" size="normal" />,
      title: version.title || version.fullVersion
    }))

  const freeModpacks = curseForgeModpacks.map((version) => ({
    type: version.name,
    icon: <Avatar image={version.icon} shape="square" size="normal" />,
    title: version.title || version.fullVersion
  }))

  const modpackCategories = [
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
  const scrollableMenuItems: MenuItem[] = modpackCategories.map((category) => ({
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
