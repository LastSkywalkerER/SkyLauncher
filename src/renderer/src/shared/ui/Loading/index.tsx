import { ProgressSpinner } from 'primereact/progressspinner'
import { FC } from 'react'

export const Loading: FC = () => {
  return <ProgressSpinner strokeWidth="8" animationDuration=".5s" />
}

export const PageLoading: FC = () => {
  return (
    <div className={'w-full h-full flex items-center justify-center'}>
      <Loading />
    </div>
  )
}
