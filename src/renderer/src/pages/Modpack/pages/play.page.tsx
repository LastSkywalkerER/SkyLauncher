import { IUser, UserData } from '@renderer/entities/User/interfaces'
import { IVersions } from '@renderer/entities/Versions/interfaces'
import { ControlsSwitcher } from '@renderer/features/LaucnherControls'
import { VersionsList } from '@renderer/features/VersionsList'
import { useLoadableState } from '@renderer/shared/hooks/useLoadableState'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { PageLoading } from '@renderer/shared/ui'
import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { FC, useEffect, useRef, useState } from 'react'

const PlayPage: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { data: userData } = useLoadableState<IUser, UserData>(IUser.$)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menu = useRef<Menu>(null)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [currentVersion])

  const handleClick = (e: React.MouseEvent): void => {
    menu.current?.toggle(e)
    setIsMenuOpen(!isMenuOpen)
  }

  if (!currentVersion) {
    return <PageLoading />
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4 w-full h-[calc(100%-60px)] relative">
        {currentVersion.titleImage && (
          <img
            src={currentVersion.titleImage}
            alt={currentVersion.name}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px]"
          />
        )}
        <img
          src={currentVersion.coverImage}
          alt={currentVersion.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex justify-between items-center h-20 px-4 bg-common-base">
        <div
          className="w-[200px] flex items-center gap-4 relative group cursor-pointer rounded-md overflow-hidden p-2 hover:bg-common-light transition-colors duration-200 justify-between"
          onClick={handleClick}
        >
          {currentVersion.modpackName && (
            <VersionsList ref={menu} modpackName={currentVersion.modpackName} />
          )}
          <div className="flex items-center gap-4">
            <Avatar image={currentVersion.icon} shape="square" size="normal" />
            <div className="flex flex-col text-sm">
              <span>{currentVersion.modpackVersion}</span>
              <span className="text-xs text-muted">{currentVersion.fullVersion}</span>
            </div>
          </div>
          {currentVersion.modpackName && (
            <i
              className={`pi ${isMenuOpen ? 'pi-chevron-up' : 'pi-chevron-down'} text-muted transition-transform duration-200 group-hover:translate-y-1`}
            />
          )}
        </div>

        <ControlsSwitcher className="text-sm relative -top-1/3" />

        <div>{userData?.userName}</div>
      </div>
    </div>
  )
}

export default PlayPage
