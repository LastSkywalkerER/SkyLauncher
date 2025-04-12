import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Background } from '../Background/index'
import { AuthGuard } from '../Guards/AuthGuard'
import { RouteNames } from './routeNames'

const Layout = lazy(() => import('../Layout/index'))
const Home = lazy(() => import('../../pages/Home/index'))
const Logs = lazy(() => import('../../pages/Logs/index'))
const Settings = lazy(() => import('../../pages/Settings/index'))
const AvailableVersions = lazy(() => import('../../pages/AvailableVersions/index'))
const Login = lazy(() => import('../../pages/Auth/LoginForm'))
const Register = lazy(() => import('../../pages/Auth/RegisterForm'))
const OfflineLogin = lazy(() => import('../../pages/Auth/OfflineForm'))
const CheckMCProfileForm = lazy(() => import('../../pages/Auth/CheckMCProfileForm'))

export const routes = createBrowserRouter([
  {
    path: RouteNames.Home,
    element: <Background />,
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
        path: RouteNames.OfflineLogin,
        element: <OfflineLogin />
      },
      {
        path: RouteNames.CheckMinecraftProfile,
        element: <CheckMCProfileForm />
      },
      {
        path: RouteNames.Home,
        element: (
          <AuthGuard>
            <Layout />
          </AuthGuard>
        ),
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
    ]
  }
])

export const routeLinks = [
  {
    name: 'Home',
    path: RouteNames.Home
  },
  {
    name: 'Settings',
    path: RouteNames.Settings
  },
  {
    name: 'Logs',
    path: RouteNames.Logs
  },
  {
    name: 'AvailableVersions',
    path: RouteNames.AvailableVersions
  }
]
