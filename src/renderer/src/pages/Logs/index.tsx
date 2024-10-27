import { LazyLog } from '@melloware/react-logviewer'
import { INodeApi } from '@renderer/entities/NodeApi/interfaces'
import { useInjection } from 'inversify-react'
import { FC, useEffect, useState } from 'react'

const Logs: FC = () => {
  const { subscribeOnLogs } = useInjection(INodeApi.$)

  const [logs, setLogs] = useState('')

  useEffect(() => {
    const subscription = subscribeOnLogs((newLog) => {
      setLogs((oldLogs) => {
        const newLogs = `${newLog}
${oldLogs}`

        return newLogs
      })
    })

    return (): void => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="h-full w-full p-10">
      <LazyLog text={logs} stream enableLinks selectableLines />
    </div>
  )
}

export default Logs
