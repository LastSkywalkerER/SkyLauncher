import { useInjection } from 'inversify-react'
import { FC } from 'react'

import { IVersions } from '../../entities/Versions/interfaces'
import { OpenButton, RemoveButton } from '../../features'
import { useObservable } from '../../shared/hooks/useObservable'
import { PlayButton } from '../../widgets/LaucnherControls/ui'

const Home: FC = () => {
  const { getCurrentMCVersion } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)

  if (!currentVersion) {
    return (
      <div className="flex flex-col justify-between items-center h-full mt-[20px]">
        Choose your game
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between items-center h-full mt-[20px] relative">
      <div className={'w-[500px] h-fit'}>
        {currentVersion?.titleImage && <img src={currentVersion?.titleImage} alt="cover" />}
      </div>
      <div className="flex gap-x-5 gap-y-10 flex-wrap p-5 bg-[var(--surface-100)] bg-opacity-90 rounded-2xl w-9/12">
        {currentVersion?.title && <h3>{currentVersion?.title}</h3>}
        {currentVersion?.description && <p>{currentVersion?.description}</p>}
        <div className={'text-xs text-gray-400'}>
          Additional info:
          <ul className="list-disc pl-5 space-y-1">
            {currentVersion?.name && (
              <li>
                <strong>Name:</strong> {currentVersion.name}
              </li>
            )}
            {currentVersion?.java && (
              <li>
                <strong>Java Version:</strong> {currentVersion.java}
              </li>
            )}
            {currentVersion?.modpackProvider && (
              <li>
                <strong>Provider:</strong> {currentVersion.modpackProvider}
              </li>
            )}
            {currentVersion?.fullVersion && (
              <li>
                <strong>Version:</strong> {currentVersion.fullVersion}
              </li>
            )}
            {currentVersion?.folder && (
              <li>
                <strong>Path:</strong> {currentVersion.folder}{' '}
              </li>
            )}
          </ul>
        </div>
      </div>
      {currentVersion.folder && (
        <div className={'absolute bottom-10 right-10 flex gap-5'}>
          <OpenButton path={currentVersion.folder} />
          <RemoveButton path={currentVersion.folder} />
        </div>
      )}
      <PlayButton />
    </div>
  )
}

export default Home
