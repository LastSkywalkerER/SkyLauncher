import { AuthLayout } from '@renderer/pages/Auth/Layout/ui/AuthLayout'
import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'

import background from '../../../../../resources/images/background.png'
import { Background } from '../Background'
import { AuthGuard } from '../Guards/AuthGuard'
import { RouteNames } from './routeNames'

const Auth = lazy(() => import('../../pages/Auth/ui/AuthPage'))
const Login = lazy(() => import('../../pages/Auth/pages/Login/ui/Login'))

export const routesFreshCraft = createBrowserRouter([
  {
    path: RouteNames.Home,
    element: (
      <AuthGuard fallbackRoute={RouteNames.Auth}>
        <Outlet />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        path: RouteNames.Home,
        element: <div>Home</div>
      }
    ]
  },
  {
    path: RouteNames.Auth,
    element: (
      <Background image={background}>
        <AuthLayout />
      </Background>
    ),
    children: [
      {
        path: RouteNames.Auth,
        element: <Auth />
      },
      {
        path: RouteNames.Auth + RouteNames.Login,
        element: <Login />
      }
    ]
  }
])
