import { IVersions } from '@renderer/entities/Versions/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { useObservableRequest } from '@renderer/shared/hooks/useObservableRequest'
import { BigButton } from '@renderer/shared/ui/default/BigButton'
import { useInjection } from 'inversify-react'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { ILauncherControlService } from '../service/interfaces'

export const InstallButton: FC<ButtonProps> = (props) => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)

  const { installGame } = useInjection(ILauncherControlService.$)
  const { execute: executeInstallGame, isLoading: isLoadingInstall } =
    useObservableRequest(installGame)

  const { isProcessActive } = useInjection(ILauncherControlService.$)
  const isProcessRunning = useObservable(isProcessActive(), false)

  const { t } = useTranslation()

  const handleInstall = (): void => {
    currentVersion && executeInstallGame(currentVersion)
  }

  return (
    <BigButton
      {...props}
      onClick={handleInstall}
      loading={isLoadingInstall || isProcessRunning}
      disabled={isProcessRunning}
    >
      {t('launcher.install')}
    </BigButton>
  )
}
