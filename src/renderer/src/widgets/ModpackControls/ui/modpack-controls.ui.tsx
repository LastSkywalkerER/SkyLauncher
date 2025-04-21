import { IVersions } from '@renderer/entities/Versions/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { BigButton } from '@renderer/shared/ui/BigButton'
import { useInjection } from 'inversify-react'
import { ButtonProps } from 'primereact/button'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const ModpackControls: FC<ButtonProps> = (props) => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const { t } = useTranslation()

  if (currentVersion?.folder) {
    return <BigButton {...props}>{t('launcher.play')}</BigButton>
  }

  if (currentVersion?.downloadUrl && !currentVersion?.folder) {
    return <BigButton {...props}>{t('launcher.install')}</BigButton>
  }

  if (!currentVersion?.downloadUrl && !currentVersion?.folder) {
    return <BigButton {...props}>{t('launcher.buy')}</BigButton>
  }

  return null
}
