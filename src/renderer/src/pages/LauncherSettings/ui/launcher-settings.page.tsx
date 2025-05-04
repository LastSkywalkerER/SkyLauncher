import { useObservableState } from '@renderer/shared/hooks/useObservableState'
import { LoadingOverlay } from '@renderer/shared/ui/default/Loading'
import { useInjection } from 'inversify-react'
import { FC } from 'react'

import type { LauncherInfo } from '../../../../../shared/dtos/launcher.dto'
import { ILauncherSettingsService } from '../services/interfaces'

const LauncherSettingsPage: FC = () => {
  const launcherSettingsService = useInjection<ILauncherSettingsService>(ILauncherSettingsService.$)
  const { data: launcherInfo, isLoading } = useObservableState<LauncherInfo>(
    launcherSettingsService.getLauncherInfo$,
    {} as LauncherInfo,
    []
  )

  return (
    <div className="bg-common-lighter h-full p-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Launcher Settings</h1>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium">Launcher</h3>
          <div className="relative">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-muted">
                <span className="">Version:</span>
                <span>{launcherInfo.version}</span>
              </div>
              <div className="flex items-center gap-1 text-muted">
                <span className="">Platform:</span>
                <span>{launcherInfo.platform}</span>
              </div>
              <div className="flex items-center gap-1 text-muted">
                <span className="">Architecture:</span>
                <span>{launcherInfo.arch}</span>
              </div>
            </div>
            {isLoading && <LoadingOverlay />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LauncherSettingsPage
