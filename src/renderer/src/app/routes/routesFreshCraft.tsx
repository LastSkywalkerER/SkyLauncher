import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import background from '../../../../../resources/images/background.png'
import { Background } from '../Background'
import { RouteNames } from './routeNames'

const Auth = lazy(() => import('../../pages/Auth/ui/AuthPage'))

export const routesFreshCraft = createBrowserRouter([
  {
    path: RouteNames.Home,
    element: <Background image={background} />,
    children: [
      {
        path: RouteNames.Home,
        element: <Auth />
      }
    ]
  }
])
