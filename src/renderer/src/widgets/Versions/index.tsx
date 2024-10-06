import { Dock as PrimeDock } from 'primereact/dock'
import { Tooltip } from 'primereact/tooltip'
import { MenuItem } from 'primereact/menuitem'
import { useInjection } from 'inversify-react'
import { INodeApi } from '../../entities/NodeApi/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import { useNavigate } from 'react-router-dom'
import { ISettings } from '../../entities/Settings/interfaces'
import { RouteNames } from '../../shared/routes/routeNames'

export const Dock = () => {
  const { getMCVersions, launchMinecraft } = useInjection(INodeApi.$)
  const versions = useObservable(getMCVersions(), {})
  const navigate = useNavigate()
  const { getSettings } = useInjection(ISettings.$)
  const settings = useObservable(getSettings(), null)

  console.log(versions)

  const dockItems: MenuItem[] = Object.entries(versions).map(([key, version]) => ({
    icon: <img src={version.icon} alt={'icon'} />,
    label: key,
    command() {
      navigate(RouteNames.Logs)
      settings && launchMinecraft(version, settings)
    }
  }))

  return (
    <div>
      <Tooltip className="dark-tooltip" target=".dock-advanced .p-dock-action" at="right center" />

      <PrimeDock model={dockItems} className={'dock-advanced'} position={'left'} />
    </div>
  )
}
