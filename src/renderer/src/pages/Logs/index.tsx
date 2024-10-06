import { LazyLog, ScrollFollow } from '@melloware/react-logviewer'
import { INodeApi } from '@renderer/entities/NodeApi/interfaces'
import { useInjection } from 'inversify-react'
import { FC, useEffect, useState } from 'react'

const Logs: FC = () => {
  const { subscribeOnLogs, unsubscribeOnLogs } = useInjection(INodeApi.$)

  const [logs, setLogs] = useState('')

  useEffect(() => {
    const subscription = subscribeOnLogs((newLog) => {
      setLogs((oldLogs) => {
        const newLogs = `${oldLogs}
        ${newLog}`

        return newLogs
      })
    })

    return (): void => {
      unsubscribeOnLogs(subscription)
    }
  }, [])

  return (
    <div className="h-full w-full">
      <ScrollFollow
        startFollowing={true}
        render={({ follow, onScroll }) => (
          <LazyLog text={logs} stream follow={follow} onScroll={onScroll} />
        )}
      />
    </div>
  )
}

export default Logs
