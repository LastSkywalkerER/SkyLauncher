import { INodeApi, Version } from '@renderer/entities/NodeApi/interfaces'
import { ISettings } from '@renderer/entities/Settings/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { RouteNames } from '@renderer/shared/routes/routeNames'
import { useInjection } from 'inversify-react'
import { Button } from 'primereact/button'
import { FC } from 'react'
import { Link } from 'react-router-dom'

const Versions: FC = () => {
  const { getMCVersions, launchMinecraft } = useInjection(INodeApi.$)
  const versions = useObservable(getMCVersions(), {})

  const { getSettings } = useInjection(ISettings.$)

  const handleButton =
    (version: Version): (() => void) =>
    (): void => {
      launchMinecraft(version, getSettings())
    }

  return (
    <div className="flex gap-5">
      {Object.entries(versions).map(([key, version]) => (
        <Button key={key} onClick={handleButton(version)}>
          <Link to={RouteNames.Logs}>{key}</Link>
        </Button>
      ))}
    </div>
  )
}

export default Versions
