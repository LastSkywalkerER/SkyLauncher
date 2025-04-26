import { BigButton } from '@renderer/shared/ui/default/BigButton'
import { useInjection } from 'inversify-react'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { RouteNames } from '../../../app/routes/routeNames'
import { IUser, UserData } from '../../../entities/User/interfaces'
import { IVersions } from '../../../entities/Versions/interfaces'
import { useLoadableState } from '../../../shared/hooks/useLoadableState'
import { useObservable } from '../../../shared/hooks/useObservable'
import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { Loading } from '../../../shared/ui'
import { ILauncherControlService } from '../service/index'

export const PlayButton: FC<ButtonProps> = (props) => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { launchGame } = useTransientInjection(ILauncherControlService.$)
  const { execute: executeLaunchGame } = useObservableRequest(launchGame)
  const { data } = useLoadableState<IUser, UserData>(IUser.$)
  const { t } = useTranslation()

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
      <BigButton {...props} onClick={handlePlayButton}>
        {t('launcher.play')}
      </BigButton>
    )
  }

  return <Loading />
}
