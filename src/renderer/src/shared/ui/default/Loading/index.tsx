import { ProgressSpinner, ProgressSpinnerProps } from 'primereact/progressspinner'
import { FC } from 'react'

export const Loading: FC<ProgressSpinnerProps> = (props) => {
  return <ProgressSpinner strokeWidth="7" animationDuration="2s" className="w-20 h-20" {...props} />
}

export const PageLoading: FC<ProgressSpinnerProps> = (props) => {
  return (
    <div className={'w-full h-full flex items-center justify-center'}>
      <Loading {...props} />
    </div>
  )
}

export const LoadingOverlay: FC = () => {
  return (
    <div className="absolute z-100 top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center bg-common-dark/50">
      <Loading className="w-10 h-10" />
    </div>
  )
}
