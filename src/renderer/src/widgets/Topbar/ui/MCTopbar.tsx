import { useInjection } from 'inversify-react'
import { MenuItem } from 'primereact/menuitem'
import { TabMenu } from 'primereact/tabmenu'
import { FC, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { RouteNames } from '../../../app/routes/routeNames'
import { IVersions } from '../../../entities/Versions/interfaces'
import { useObservable } from '../../../shared/hooks/useObservable'

export const MCTopbar: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const navigate = useNavigate()
  const { modpackId } = useParams()
  const [, startTransition] = useTransition()
  const location = useLocation()
  const { t } = useTranslation()

  const handleNavigation = (routeName: string): void => {
    startTransition(() => navigate(routeName.replace(':modpackId', modpackId || '')))
  }

  const topMenuItems: MenuItem[] = [
    {
      label: t('topbar.play'),
      data: RouteNames.ModpackPlay,
      command: () => handleNavigation(RouteNames.ModpackPlay)
    },
    {
      label: t('topbar.settings'),
      data: RouteNames.ModpackSettings,
      command: () => handleNavigation(RouteNames.ModpackSettings)
    },
    {
      label: t('topbar.skins'),
      data: RouteNames.ModpackSkins,
      command: () => handleNavigation(RouteNames.ModpackSkins)
    },
    {
      label: t('topbar.servers'),
      data: RouteNames.ModpackServers,
      command: () => handleNavigation(RouteNames.ModpackServers)
    }
  ]

  const activeIndex = topMenuItems.findIndex(
    (item) => item.data?.replace(':modpackId', modpackId || '') === location.pathname
  )

  return (
    <div className="w-full flex flex-col bg-common-base">
      {currentVersion && <div className="px-5 pt-5 text-sm">{currentVersion.name}</div>}
      <TabMenu
        model={topMenuItems}
        activeIndex={activeIndex}
        onTabChange={() => {
          //
        }}
        pt={{ inkbar: { className: 'bg-primary-base' } }}
      />
    </div>
  )
}
