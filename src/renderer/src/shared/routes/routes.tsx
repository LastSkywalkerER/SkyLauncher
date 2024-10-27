import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RouteNames } from './routeNames'

const Layout = lazy(() => import('../../app/Layout'))
const Home = lazy(() => import('../../pages/Home'))
const Logs = lazy(() => import('../../pages/Logs'))
const Settings = lazy(() => import('../../pages/Settings'))
const AvailableVersions = lazy(() => import('../../pages/AvailableVersions'))

export const routes = createBrowserRouter([
  {
    path: RouteNames.Home,
    element: <Layout />,
    children: [
      {
        index: true,
        path: RouteNames.Home,
        element: <Home />
      },
      {
        path: RouteNames.AvailableVersions,
        element: <AvailableVersions />
      },
      {
        path: RouteNames.Logs,
        element: <Logs />
      },
      {
        path: RouteNames.Settings,
        element: <Settings />
      },
      {
        path: '*',
        element: <Navigate to={RouteNames.Home} />
      }
    ]
  }
])
