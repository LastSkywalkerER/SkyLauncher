import { environment } from '@renderer/app/config/environments'
import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { MenuItem } from 'primereact/menuitem'
import { startTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { RouteNames } from '../../../app/routes/routeNames'
import { IVersions } from '../../../entities/Versions/interfaces'
import { useObservable } from '../../../shared/hooks/useObservable'
import { Profile } from '../ui/Profile'
import { createMenuItem } from './create-munu-items'

interface MenuItemsReturn {
  topMenuItems: MenuItem[]
  scrollableMenuItems: MenuItem[]
  bottomMenuItems: MenuItem[]
  activeItemId: string
}

export const useMenuItems = (): MenuItemsReturn => {
  const { getCustomMCVersions, getCurseForgeModpacks, setCurrentMCVersion } = useInjection(
    IVersions.$
  )
  const { t } = useTranslation()
  const versions = useObservable(getCustomMCVersions(), [])
  const curseForgeModpacks = useObservable(getCurseForgeModpacks(), [])
  const location = useLocation()
  const navigate = useNavigate()
  const { modpackId } = useParams()

  const getActiveItemId = (): string => {
    const path = location.pathname
    if (path === RouteNames.Home) return 'home'
    if (path === RouteNames.Settings) return 'settings'
    if (modpackId) return modpackId

    return 'home'
  }

  const handleItemClick = (itemId: string): void => {
    if (itemId === 'home') {
      startTransition(() => {
        navigate(RouteNames.Home)
      })
    } else if (itemId === 'settings') {
      startTransition(() => {
        navigate(RouteNames.Settings)
      })
    } else {
      // Extract modpackProvider and index from itemId (format: "modpackProvider-index")
      const [modpackProvider, indexStr] = itemId.split('-')
      const index = parseInt(indexStr, 10)

      // Find the version in either premium or free modpacks based on the index
      const version =
        modpackProvider === environment.uiType ? versions[index] : curseForgeModpacks[index]

      if (version) {
        setCurrentMCVersion(version)
      }

      startTransition(() => {
        navigate(RouteNames.ModpackPlay.replace(':modpackId', itemId || ''))
      })
    }
  }

  const activeItemId = getActiveItemId()

  // Top fixed items
  const topMenuItems: MenuItem[] = [
    {
      template: <Profile />
    },
    createMenuItem(
      {
        id: 'home',
        icon: 'pi pi-fw pi-home text-2xl',
        title: t('menu.home'),
        subtitle: ''
      },
      activeItemId,
      handleItemClick
    )
  ]

  const premiumModpacks = versions
    .filter((version) => version.modpackProvider === environment.uiType)
    .map((version, index) => ({
      type: version.modpackName!,
      icon: <Avatar image={version.icon} shape="square" size="normal" />,
      title: version.title || version.modpackProvider,
      id: `${version.modpackProvider}-${index}`
    }))

  const freeModpacks = curseForgeModpacks.map((version, index) => ({
    type: version.title,
    icon: <Avatar image={version.icon} shape="square" size="normal" />,
    title: version.modpackProvider,
    id: `${version.modpackProvider}-${index}`
  }))

  const modpackCategories = [
    {
      label: t('menu.premium'),
      className: 'text-yellow-500 cube-border',
      icon: 'pi pi-fw pi-home',
      modpacks: premiumModpacks
    },
    {
      label: t('menu.free'),
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
          id: modpack.id!,
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
        icon: 'pi pi-fw pi-sliders-h text-2xl',
        title: t('common.settings'),
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
