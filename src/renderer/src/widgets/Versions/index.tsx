import { Dock as PrimeDock } from 'primereact/dock'
import { Tooltip } from 'primereact/tooltip'
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem'
import { useInjection } from 'inversify-react'
import { INodeApi } from '../../entities/NodeApi/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { useNavigate } from 'react-router-dom'
import { ISettings } from '../../entities/Settings/interfaces'
import { RouteNames } from '../../shared/routes/routeNames'
import icon from '../../../../../resources/icon.png'

export const Dock = () => {
  const { getMCVersions, launchMinecraft } = useInjection(INodeApi.$)
  const versions = useObservable(getMCVersions(), {})
  const navigate = useNavigate()
  const { getSettings } = useInjection(ISettings.$)

  const dockItems: MenuItem[] = Object.entries(versions).map(([key, version]) => ({
    icon: <img src={icon} />,
    label: key,
    command(event: MenuItemCommandEvent) {
      navigate(RouteNames.Logs)
      launchMinecraft(version, getSettings())
    }
  }))

  return (
    <div>
      <Tooltip
        className="dark-tooltip"
        target=".dock-advanced .p-dock-action"
        mx="left+50 center"
        at="right center"
      />

      <PrimeDock model={dockItems} className={'dock-advanced'} position={'left'} />
    </div>
  )
}
