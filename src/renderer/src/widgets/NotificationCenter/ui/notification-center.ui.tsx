import { useTransientInjection } from '@renderer/shared/hooks/useTransientInjection'
import { Toast, ToastProps } from 'primereact/toast'
import { FC, useEffect, useRef } from 'react'

import { INotificationCenterService } from '../service'

export const NotificationCenter: FC<ToastProps> = (props) => {
  const toast = useRef<Toast | null>(null)
  const { getProgress } = useTransientInjection(INotificationCenterService.$)

  useEffect(() => {
    const subscribtion = getProgress().subscribe((data) => {
      const notFinishedProcessed = Object.values(data)[0]

      // if (notFinishedProcessed?.status === 'finished') {
      //   toast.current?.show({
      //     severity: 'info',
      //     summary: notFinishedProcessed?.status,
      //     detail: `${notFinishedProcessed.processName} ${notFinishedProcessed?.status}`
      //   })
      // }

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

  return <Toast {...props} ref={toast}></Toast>
}
