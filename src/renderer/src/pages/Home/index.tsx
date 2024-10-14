import { useInjection } from 'inversify-react'
import { FC, HTMLAttributes } from 'react'
import play from '../../../../../resources/images/play_button_big.png'
import { IMCGameVersion } from '../../../../entities/mc-game-version/mc-game-version.interface'
import { IVersions } from '../../entities/Versions/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'
import cx from 'classnames'

const BigButton: FC<HTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    {...props}
    className={cx(
      'w-[200px] transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-300',
      className
    )}
  >
    {children}
  </button>
)

type ButtonStatus = 'installed' | 'checked'

const getButtonStatus = (version: IMCGameVersion): ButtonStatus => {
  const statuses: Record<ButtonStatus, boolean> = {
    installed: !!version.folder && !version.status?.libs && !version.status?.native,
    checked: !!version.folder && !!version.status?.libs && !!version.status?.native
  }

  return Object.entries(statuses).find(([, value]) => value)?.[0] as ButtonStatus
}

const Home: FC = () => {
  const { getCurrentMCVersion, launchGame } = useInjection(IVersions.$)
  const currentVersion = useObservable(getCurrentMCVersion(), null)

  if (!currentVersion) {
    return (
      <div className="flex flex-col justify-between items-center h-full mt-[20px]">
        Choose your game
      </div>
    )
  }

  const buttonStatus = getButtonStatus(currentVersion)

  return (
    <div className="flex flex-col justify-between items-center h-full mt-[20px]">
      <div className={'w-[500px] h-fit'}>
        {currentVersion?.titleImage && <img src={currentVersion?.titleImage} alt="cover" />}
        {currentVersion?.title && <h3>{currentVersion?.title}</h3>}
      </div>
      <div>{currentVersion?.title && <p>{currentVersion?.title}</p>}</div>
      {buttonStatus === 'installed' && 'Loading'}
      {buttonStatus === 'checked' && (
        <BigButton onClick={() => launchGame(currentVersion)}>
          <img src={play} alt="play" />
        </BigButton>
      )}
    </div>
  )
}

export default Home
