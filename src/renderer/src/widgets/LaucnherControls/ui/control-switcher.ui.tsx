import { IVersions } from '@renderer/entities/Versions/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { BigButton } from '@renderer/shared/ui/BigButton'
import { PlayButton } from '@renderer/widgets/LaucnherControls/ui'
import { useInjection } from 'inversify-react'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { InstallButton } from './install-button.io'

export const ControlsSwitcher: FC<ButtonProps> = (props) => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)

  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { t } = useTranslation()

  if (!currentVersion) {
    return null
  }

  if (currentVersion?.folder) {
    return <PlayButton {...props} />
  }

  if (currentVersion?.downloadUrl && !currentVersion?.folder) {
    return <InstallButton {...props} />
  }

  if (!currentVersion?.downloadUrl && !currentVersion?.folder) {
    return <BigButton {...props}>{t('launcher.buy')}</BigButton>
  }

  return null
}
