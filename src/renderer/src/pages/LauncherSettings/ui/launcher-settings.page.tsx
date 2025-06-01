import { useObservableRequest } from '@renderer/shared/hooks/useObservableRequest'
import { useObservableState } from '@renderer/shared/hooks/useObservableState'
import { LoadingOverlay } from '@renderer/shared/ui/default/Loading'
import { FCMainButton } from '@renderer/shared/ui/freshcraft/Button/ui/button.ui'
import { FCCheckboxFieldControlled } from '@renderer/shared/ui/freshcraft/Checkbox/ui/checkbox.field'
import { useInjection } from 'inversify-react'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { LauncherInfo } from '../../../../../shared/dtos/launcher.dto'
import { LauncherSettings } from '../../../entities/Settings/interfaces'
import { LauncherSettingsFormData } from '../launcher-settings.types'
import { ILauncherSettingsService } from '../services/interfaces'

const LauncherSettingsPage: FC = () => {
  const { t } = useTranslation()
  const { getLauncherInfo$, getSettings, setSettings } = useInjection<ILauncherSettingsService>(
    ILauncherSettingsService.$
  )
  const { data: launcherInfo, isLoading } = useObservableState<LauncherInfo>(
    getLauncherInfo$,
    {} as LauncherInfo,
    []
  )
  const { data: settings } = useObservableState<LauncherSettings | null>(getSettings(), null, [])
  const { execute: executeSetSettings, isLoading: isSaving } = useObservableRequest(setSettings)

  const { control, handleSubmit, setValue } = useForm<LauncherSettingsFormData>()

  useEffect(() => {
    if (settings) {
      setValue('isLaunchAfterInstall', settings.isLaunchAfterInstall!)
      setValue('isHideAfterLaunch', settings.isHideAfterLaunch!)
    }
  }, [settings, setValue])

  const onSubmit: SubmitHandler<LauncherSettingsFormData> = (data) => {
    executeSetSettings(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <div className="bg-common-lighter h-full p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">{t('launcher.settings')}</h1>

          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium">{t('launcher.launcherInfo')}</h3>
            <div className="relative">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-muted">
                  <span className="">{t('launcher.version')}:</span>
                  <span>{launcherInfo.version}</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <span className="">{t('launcher.platform')}:</span>
                  <span>{launcherInfo.platform}</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <span className="">{t('launcher.architecture')}:</span>
                  <span>{launcherInfo.arch}</span>
                </div>
              </div>
              {isLoading && <LoadingOverlay />}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">{t('launcher.gameSettings')}</h3>
            <FCCheckboxFieldControlled
              name="isLaunchAfterInstall"
              control={control}
              label={t('launcher.launchAfterInstall')}
            />
            <FCCheckboxFieldControlled
              name="isHideAfterLaunch"
              control={control}
              label={t('launcher.hideAfterLaunch')}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <FCMainButton type="submit" label={t('launcher.saveSettings')} loading={isSaving} />
        </div>
      </div>
    </form>
  )
}

export default LauncherSettingsPage
