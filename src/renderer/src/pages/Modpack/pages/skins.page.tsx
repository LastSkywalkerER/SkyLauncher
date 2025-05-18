import { IMsalApi } from '@renderer/shared/api/MsalApi'
import { useObservableState } from '@renderer/shared/hooks/useObservableState'
import { PageLoading } from '@renderer/shared/ui'
import { useInjection } from 'inversify-react'
import { FC } from 'react'
import ReactSkinview3d from 'react-skinview3d'
import { WalkingAnimation } from 'skinview3d'

const SkinsPage: FC = () => {
  const { getMojangProfile } = useInjection(IMsalApi.$)
  const { data, isLoading } = useObservableState(getMojangProfile(), null)

  if (isLoading) {
    return <PageLoading />
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <div className="w-full h-full flex flex-wrap overflow-y-auto">
      {data.skins.map((skin, index) => (
        <ReactSkinview3d
          key={skin.id}
          skinUrl={skin.url}
          capeUrl={data.capes[index].url}
          height="300"
          width="300"
          options={{ animation: new WalkingAnimation() }}
        />
      ))}
    </div>
  )
}

export default SkinsPage
