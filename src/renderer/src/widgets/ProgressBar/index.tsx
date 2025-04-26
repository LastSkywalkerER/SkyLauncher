import { ProgressBar as PrimeProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { Toast } from 'primereact/toast'
import { FC, useEffect, useRef } from 'react'

import { useObservable } from '../../shared/hooks/useObservable'
import { useTransientInjection } from '../../shared/hooks/useTransientInjection'
import { IProcessProgress } from './service/interfaces'

export const ProgressBar: FC<Omit<ProgressBarProps, 'value'>> = ({ className, ...props }) => {
  const toast = useRef<Toast | null>(null)
  const { getProgress } = useTransientInjection(IProcessProgress.$)
  const progress = useObservable(getProgress(), {})

  useEffect(() => {
    const subscribtion = getProgress().subscribe((data) => {
      const notFinishedProcessed = Object.values(data)[0]

      if (notFinishedProcessed?.status === 'finished') {
        toast.current?.show({
          severity: 'info',
          summary: notFinishedProcessed?.status,
          detail: `${notFinishedProcessed.processName} ${notFinishedProcessed?.status}`
        })
      }

      if (notFinishedProcessed?.status === 'failed') {
        toast.current?.show({
          severity: 'error',
          summary: notFinishedProcessed?.status,
          detail: `${notFinishedProcessed.processName} ${notFinishedProcessed?.status}`
        })
      }
    })

    return (): void => {
      subscribtion.unsubscribe()
    }
  }, [])

  const progressData = Object.values(progress).map(
    ({ currentValue, minValue, maxValue, processName }) => (
      <div key={processName} className="h-full flex flex-col">
        <p className={'text-base'}>{processName}</p>
        <PrimeProgressBar
          {...props}
          value={Math.round((currentValue / (maxValue - minValue)) * 100)}
          className="h-full"
        />
      </div>
    )
  )

  return (
    <div className="card">
      <Toast ref={toast}></Toast>
      {progressData.length > 0 && <div className={className}>{progressData}</div>}
    </div>
  )
}
