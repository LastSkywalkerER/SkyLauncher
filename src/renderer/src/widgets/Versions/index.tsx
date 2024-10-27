import cx from 'classnames'
import { useInjection } from 'inversify-react'
import { Dock as PrimeDock } from 'primereact/dock'
import { MenuItem } from 'primereact/menuitem'
import { Tooltip } from 'primereact/tooltip'
import { FC } from 'react'

import { IMCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.interface'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'

export const Dock: FC = () => {
  const { getLocalMCVersions, setCurrentMCVersion, getCurrentMCVersion } = useInjection(IVersions.$)
  const versions = useObservable(getLocalMCVersions(), [] as IMCGameVersion[])
  const currentVersion = useObservable(getCurrentMCVersion(), null)

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
    }
  }))

  return (
    <div>
      <Tooltip className="dark-tooltip" target=".dock-advanced .p-dock-action" at="right center" />

      <PrimeDock model={dockItems} className={'dock-advanced'} position={'left'} />
    </div>
  )
}
