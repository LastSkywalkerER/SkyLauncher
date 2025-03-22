import cx from 'classnames'
import { useInjection } from 'inversify-react'
import { Dock as PrimeDock } from 'primereact/dock'
import { MenuItem } from 'primereact/menuitem'
import { Tooltip } from 'primereact/tooltip'
import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { IMCGameVersion } from '../../../../shared/entities/mc-game-version/mc-game-version.interface'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { RouteNames } from '../../shared/routes/routeNames'

export const Dock: FC = () => {
  const { getLocalMCVersions, setCurrentMCVersion, getCurrentMCVersion } = useInjection(IVersions.$)
  const versions = useObservable(getLocalMCVersions(), [] as IMCGameVersion[])
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const navigate = useNavigate()

  useEffect(() => {
    versions[0] && setCurrentMCVersion(versions[0])
  }, [versions[0]])

  const dockItems: MenuItem[] = versions.map((version) => ({
    icon: (
      <img
        className={cx({ ['scale-110']: currentVersion?.name === version.name })}
        src={version.icon}
        alt={'icon'}
      />
    ),
    label: version.name,
    command(): void {
      setCurrentMCVersion(version)
      navigate(RouteNames.Home)
    }
  }))

  return (
    <div>
      <Tooltip className="dark-tooltip" target=".dock-advanced .p-dock-action" at="right center" />

      <PrimeDock model={dockItems} className={'dock-advanced'} position={'left'} />
    </div>
  )
}
