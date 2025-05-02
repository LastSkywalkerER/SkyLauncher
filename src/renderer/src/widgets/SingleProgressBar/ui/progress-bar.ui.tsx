import { useLoadableState } from '@renderer/shared/hooks/useLoadableState'
import cx from 'classnames'
import { ProgressBar as PrimeProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { FC } from 'react'
import { ProcessProgressData } from 'src/shared/dtos/process-progress.dto'

import { ISingleProcessProgress } from '../service'

// const progressData = {
//   currentValue: 50,
//   id: '123',
//   maxValue: 100,
//   minValue: 0,
//   unit: '%',
//   status: 'inProgress',
//   processName: 'test'
// }

// const progressData = null

export const SingleProgressBar: FC<Omit<ProgressBarProps, 'value'>> = ({ className, ...props }) => {
  const { data: progressData } = useLoadableState<ISingleProcessProgress, ProcessProgressData>(
    ISingleProcessProgress.$
  )

  console.log({ progressData })

  if (!progressData) return null

  return (
    <div className={cx('p-2 w-full h-10', className)}>
      <div key={progressData.processName} className="w-full h-full relative">
        <span className="text-main capitalize z-10 absolute top-1/2 left-4 -translate-y-1/2">
          {`${progressData.processName}\u00A0${progressData.currentValue}\u00A0${progressData.unit}\u00A0/\u00A0${progressData.maxValue}\u00A0${progressData.unit}`}
        </span>
        <PrimeProgressBar
          {...props}
          showValue={false}
          pt={{
            root: { className: 'bg-common-dark' },
            value: { className: 'bg-primary-base text-main' }
          }}
          value={Math.round(
            (progressData.currentValue / (progressData.maxValue - progressData.minValue)) * 100
          )}
          className="h-full"
        />
      </div>
    </div>
  )
}
