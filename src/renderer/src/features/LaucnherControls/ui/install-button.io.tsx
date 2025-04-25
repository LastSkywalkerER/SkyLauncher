import { IVersions } from '@renderer/entities/Versions/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { useObservableRequest } from '@renderer/shared/hooks/useObservableRequest'
import { BigButton } from '@renderer/shared/ui/BigButton'
import { useInjection } from 'inversify-react'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const InstallButton: FC<ButtonProps> = (props) => {
  const { getCurrentMCVersion, installGame } = useInjection(IVersions.$)
  const { execute: executeInstallGame, isLoading: isLoadingInstall } =
    useObservableRequest(installGame)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { t } = useTranslation()

  const handleInstall = (): void => {
    currentVersion && executeInstallGame(currentVersion)
  }

  return (
    <BigButton {...props} onClick={handleInstall} loading={isLoadingInstall}>
      {t('launcher.install')}
    </BigButton>
  )
}
