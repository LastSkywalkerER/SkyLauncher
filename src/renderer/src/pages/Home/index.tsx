import { FC } from 'react'
import cover from '../../../../../resources/images/minecraft_fresh.png'
import play from '../../../../../resources/images/play_button_big.png'

const Home: FC = () => {
  return (
    <div className="flex flex-col justify-between items-center h-full mt-[20px]">
      <div className={'w-[500px] h-fit'}>
        <img src={cover} alt="cover" />
      </div>
      <button
        className={
          'w-[200px] transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-300'
        }
      >
        <img src={play} alt="play" />
      </button>
    </div>
  )
}

export default Home
