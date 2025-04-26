import { IVersions } from '@renderer/entities/Versions/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { PageLoading } from '@renderer/shared/ui'
import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { FC } from 'react'

import { SettingsForm } from '../ui/settings.form'

const SettingsPage: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)

  if (!currentVersion) return <PageLoading />

  return (
    <div className="p-4 flex flex-col gap-4 h-full items-center justify-between">
      <div className="text-sm flex flex-col items-center gap-2">
        <Avatar image={currentVersion?.icon} shape="square" size="normal" />
        <p>{currentVersion.modpackName}</p>
        <p>{currentVersion.name}</p>
        <p>{currentVersion.fullVersion}</p>
      </div>

      {currentVersion.folder && (
        <SettingsForm
          defaultValues={{
            folder: currentVersion.folder,
            fullscreen: false,
            height: 1080,
            javaArgs: '',
            javaArgsMaxMemory: 1024,
            javaArgsMinMemory: 1024,
            javaPath: '',
            width: 1920
          }}
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      )}
    </div>
  )
}

export default SettingsPage
