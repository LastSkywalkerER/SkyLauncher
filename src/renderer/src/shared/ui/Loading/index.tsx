import { ProgressSpinner, ProgressSpinnerProps } from 'primereact/progressspinner'
import { FC } from 'react'

export const Loading: FC<ProgressSpinnerProps> = (props) => {
  return <ProgressSpinner strokeWidth="7" animationDuration="2s" className="w-20 h-20" {...props} />
}

export const PageLoading: FC = () => {
  return (
    <div className={'w-full h-агдд flex items-center justify-center'}>
      <Loading />
    </div>
  )
}

export const LoadingOverlay: FC = () => {
  return (
    <div className="absolute z-100 top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center bg-gray-800 bg-opacity-90">
      <Loading />
    </div>
  )
}
