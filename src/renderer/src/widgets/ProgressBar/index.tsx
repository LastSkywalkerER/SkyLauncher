import { useInjection } from 'inversify-react'
import { useState, useEffect, useRef, FC, Fragment } from 'react'
import { ProgressBar as PrimeProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { Toast } from 'primereact/toast'
import { IProcessProgress } from '../../entities/ProcessProgress/interfaces'
import { useObservable } from '../../shared/hooks/useObservable'

export const ProgressBar: FC<Omit<ProgressBarProps, 'value'>> = ({ className, ...props }) => {
  const toast = useRef<Toast | null>(null)
  const { getProgress } = useInjection(IProcessProgress.$)
  const progress = useObservable(getProgress(), {})

  useEffect(() => {
    const subscribtion = getProgress().subscribe((data) => {
      const notFinishedProcessed = Object.values(data)[0]

      if (notFinishedProcessed.status === 'finished') {
        toast.current.show({
          severity: 'info',
          summary: notFinishedProcessed.status,
          detail: `${notFinishedProcessed.processName} ${notFinishedProcessed.status}`
        })
      }
    })

    return (): void => {
      subscribtion.unsubscribe()
    }
  }, [])

  const progressData = Object.values(progress).map(
    ({ currentValue, minValue, maxValue, processName }) => (
      <div key={processName}>
        <p className={'text-base'}>{processName}</p>
        <PrimeProgressBar
          {...props}
          value={Math.round((currentValue / (maxValue - minValue)) * 100)}
        />
      </div>
    )
  )

  return (
    <div className="card">
      <Toast ref={toast}></Toast>
      <div className={className}>{progressData}</div>
    </div>
  )
}