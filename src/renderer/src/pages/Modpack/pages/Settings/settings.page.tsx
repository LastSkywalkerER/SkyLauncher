import { IVersions } from '@renderer/entities/Versions/interfaces'
import { useObservable } from '@renderer/shared/hooks/useObservable'
import { useObservableRequest } from '@renderer/shared/hooks/useObservableRequest'
import { PageLoading } from '@renderer/shared/ui'
import { useInjection } from 'inversify-react'
import { Avatar } from 'primereact/avatar'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { SettingsForm } from './settings.form'
import { ModpackSettings } from './settings.types'

const SettingsPage: FC = () => {
  const { getCurrentMCVersion, updateLocalMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)
  const navigate = useNavigate()
  const { execute: executeUpdateLocalMCVersion } = useObservableRequest(updateLocalMCVersion)

  if (!currentVersion) return <PageLoading />

  const handleSubmit = async ({
    folder,
    fullscreen,
    height,
    javaArgs,
    javaArgsMaxMemory,
    javaArgsMinMemory,
    // javaPath,
    javaVersion,
    width
  }: ModpackSettings): Promise<void> => {
    executeUpdateLocalMCVersion({
      folder,
      fullscreen,
      height,
      javaArgs,
      javaArgsMaxMemory,
      javaArgsMinMemory,
      // javaPath,
      java: javaVersion,
      width
    })
    navigate(-1)
  }

  const handleCancel = (): void => {
    navigate(-1)
  }

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
            fullscreen: currentVersion.fullscreen ?? false,
            height: currentVersion.height ?? 1080,
            javaArgs: currentVersion.javaArgs ?? '',
            javaArgsMaxMemory: currentVersion.javaArgsMaxMemory ?? 1024,
            javaArgsMinMemory: currentVersion.javaArgsMinMemory ?? 1024,
            // javaPath: currentVersion.javaPath ?? '',
            javaVersion: currentVersion.java ?? '',
            width: currentVersion.width ?? 1920
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default SettingsPage
