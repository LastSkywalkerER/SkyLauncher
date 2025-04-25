import { IUser, UserData } from '@renderer/entities/User/interfaces'
import { IVersions } from '@renderer/entities/Versions/interfaces'
import { ControlsSwitcher } from '@renderer/features/LaucnherControls'
import { OpenButton } from '@renderer/features/OpenFolder/ui'
import { RemoveButton } from '@renderer/features/RemoveFolder/ui'
import { useLoadableState } from '@renderer/shared/hooks/useLoadableState'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { FC } from 'react'

const PlayPage: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { data: userData } = useLoadableState<IUser, UserData>(IUser.$)

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4 w-full h-full relative">
        {currentVersion?.titleImage && (
          <img
            src={currentVersion?.titleImage}
            alt={currentVersion?.name}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px]"
          />
        )}
        <img
          src={currentVersion?.coverImage}
          alt={currentVersion?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0">
          {currentVersion?.folder && <OpenButton path={currentVersion?.folder} />}
          {currentVersion?.folder && <RemoveButton path={currentVersion?.folder} />}
        </div>
      </div>
      <div className="flex justify-between items-center h-20 px-4 bg-common-base">
        <div className="flex items-center gap-4">
          <Avatar image={currentVersion?.icon} shape="square" size="normal" />
          <div className="flex flex-col text-sm">
            <span>{currentVersion?.modpackVersion}</span>
            <span className="text-xs text-muted">{currentVersion?.fullVersion}</span>
          </div>
        </div>

        <ControlsSwitcher className="text-sm relative -top-1/3" />

        <div>{userData?.userName}</div>
      </div>
    </div>
  )
}

export default PlayPage
