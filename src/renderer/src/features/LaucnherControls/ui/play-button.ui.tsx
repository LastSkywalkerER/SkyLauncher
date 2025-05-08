import { BigButton } from '@renderer/shared/ui/default/BigButton'
import { useInjection } from 'inversify-react'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { IVersions } from '../../../entities/Versions/interfaces'
import { useObservable } from '../../../shared/hooks/useObservable'
import { useObservableRequest } from '../../../shared/hooks/useObservableRequest'
import { useTransientInjection } from '../../../shared/hooks/useTransientInjection'
import { Loading } from '../../../shared/ui'
import { ILauncherControlService } from '../service/index'

export const PlayButton: FC<ButtonProps> = ({ onClick, ...props }) => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { launchGame } = useTransientInjection(ILauncherControlService.$)
  const { execute: executeLaunchGame, isLoading } = useObservableRequest(launchGame)
  const { t } = useTranslation()

  const handlePlayButton = (event: React.MouseEvent<HTMLButtonElement>): void => {
    currentVersion && executeLaunchGame(currentVersion)
    onClick?.(event)
  }

  if (currentVersion?.folder) {
    return (
      <BigButton {...props} onClick={handlePlayButton} loading={isLoading}>
        {t('launcher.play')}
      </BigButton>
    )
  }

  return <Loading />
}
