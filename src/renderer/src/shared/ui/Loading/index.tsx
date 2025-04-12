import { ProgressSpinner, ProgressSpinnerProps } from 'primereact/progressspinner'
import { FC } from 'react'

export const Loading: FC<ProgressSpinnerProps> = (props) => {
  return <ProgressSpinner strokeWidth="7" animationDuration="2s" className="w-20 h-20" {...props} />
}

export const PageLoading: FC = () => {
  return (
    <div className={'w-full h-full flex items-center justify-center'}>
      <Loading />
    </div>
  )
}
