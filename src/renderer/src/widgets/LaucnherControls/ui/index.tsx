import cx from 'classnames'
import { useInjection } from 'inversify-react'
import { FC, HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'

import play from '../../../../../../resources/images/play_button_big.png'
import { RouteNames } from '../../../app/routes/routeNames'
import { IUser, UserData } from '../../../entities/User/interfaces'
import { IVersions } from '../../../entities/Versions/interfaces'
import { useLoadableState } from '../../../shared/hooks/useLoadableState'
import { useObservable } from '../../../shared/hooks/useObservable'
import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { Loading } from '../../../shared/ui'
import { ILauncherControlService } from '../service/index'

const BigButton: FC<HTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    {...props}
    className={cx(
      'w-[200px] transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-300',
      className
    )}
  >
    {children}
  </button>
)

export const PlayButton: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { launchGame } = useTransientInjection(ILauncherControlService.$)
  const { execute: executeLaunchGame } = useObservableRequest(launchGame)
  const { data } = useLoadableState<IUser, UserData>(IUser.$)

  const navigate = useNavigate()

  const handlePlayButton = (): void => {
    if (!data?.userName) {
      navigate(RouteNames.CheckMinecraftProfile)

      return
    }

    currentVersion && executeLaunchGame(currentVersion)
    navigate(RouteNames.Logs)
  }

  if (currentVersion?.folder) {
    return (
      <BigButton onClick={handlePlayButton}>
        <img src={play} alt="play" />
      </BigButton>
    )
  }

  return <Loading />
}
