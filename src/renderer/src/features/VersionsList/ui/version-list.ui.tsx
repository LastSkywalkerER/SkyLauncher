import { IVersions } from '@renderer/entities/Versions/interfaces'
import { IMCLocalGameVersion } from '@renderer/entities/Versions/interfaces'
import { useObservableState } from '@renderer/shared/hooks/useObservableState'
import { LoadingOverlay } from '@renderer/shared/ui'
import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { forwardRef, ForwardRefRenderFunction } from 'react'

export interface IVersionListProps {
  modpackName: string
}

const VersionsListRenderer: ForwardRefRenderFunction<Menu, IVersionListProps> = (
  { modpackName, ...props },
  ref
) => {
  const { getModpackVersions, setCurrentMCVersion } = useInjection(IVersions.$)
  const {
    data: versions,
    isLoading,
    isLoaded
  } = useObservableState(getModpackVersions(modpackName), [], [modpackName])

  const items: MenuItem[] = versions.map((version: IMCLocalGameVersion) => ({
    template: (
      <div
        className="w-[200px] flex items-center gap-4 justify-between p-2 hover:bg-common-light cursor-pointer rounded"
        onClick={() => setCurrentMCVersion(version)}
      >
        <div className="flex items-center gap-3">
          <Avatar image={version.icon} size="normal" shape="circle" />
          <div className="flex flex-col text-sm">
            <span className="font-semibold">{version.modpackVersion}</span>
            <span className="text-muted text-xs">{version.fullVersion}</span>
          </div>
        </div>
        <i className={`pi ${version.isInstalled ? 'pi-check' : 'pi-download'} text-sm`} />
      </div>
    )
  }))

  if (isLoading) return <LoadingOverlay />

  if (isLoaded)
    return <Menu popup model={items} ref={ref} className="bg-common-base p-0 w-min" {...props} />

  return 'Something went wrong'
}

export const VersionsList = forwardRef(VersionsListRenderer)
