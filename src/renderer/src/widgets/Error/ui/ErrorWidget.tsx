import { Card } from 'primereact/card'
import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { RouteNames } from '../../../app/routes/routeNames'

export const ErrorWidget: FC = () => {
  const location = useLocation()
  console.log({ location })

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Card
        title="Error"
        pt={{
          content: { className: 'flex flex-col gap-4 items-center justify-center' },
          title: { className: 'text-center' }
        }}
      >
        <p className="text-sm text-gray-500">Something went wrong</p>
        <Link to={RouteNames.Home} reloadDocument>
          Go Home
        </Link>
        <Link to={RouteNames.Auth} reloadDocument>
          Go Auth
        </Link>
      </Card>
    </div>
  )
}
