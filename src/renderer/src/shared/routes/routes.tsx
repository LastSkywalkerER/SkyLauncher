import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AuthGuard } from '../Guards/AuthGuard'
import { RouteNames } from './routeNames'

const Layout = lazy(() => import('../../app/Layout'))
const Home = lazy(() => import('../../pages/Home'))
const Logs = lazy(() => import('../../pages/Logs'))
const Settings = lazy(() => import('../../pages/Settings'))
const AvailableVersions = lazy(() => import('../../pages/AvailableVersions'))
const Login = lazy(() => import('../../pages/Auth/LoginForm'))
const Register = lazy(() => import('../../pages/Auth/RegisterForm'))

export const routes = createBrowserRouter([
  {
    path: RouteNames.Home,
    element: <Layout />,
    children: [
      {
        path: RouteNames.Login,
        element: <Login />
      },
      {
        path: RouteNames.Register,
        element: <Register />
      },
      {
        index: true,
        path: RouteNames.Home,
        element: (
          <AuthGuard>
            <Home />
          </AuthGuard>
        )
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
