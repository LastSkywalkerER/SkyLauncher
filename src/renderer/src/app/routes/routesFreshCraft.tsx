import { HomeLayout } from '@renderer/app/Layout/HomeLayout'
import { AuthLayout } from '@renderer/pages/Auth/Layout/ui/AuthLayout'
import { ModpackLayout } from '@renderer/pages/Modpack/layout/modpack.layout'
import { ErrorWidget } from '@renderer/widgets/Error'
import { MCSidebar } from '@renderer/widgets/Sidebar/ui/MCSidebar'
import { MCTopbar } from '@renderer/widgets/Topbar/ui/MCTopbar'
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import background from '../../../../../resources/images/background.png'
import { Background } from '../Background'
import { AuthGuard } from '../Guards/AuthGuard'
import { RouteNames } from './routeNames'

const Auth = lazy(() => import('../../pages/Auth/ui/AuthPage'))
const Login = lazy(() => import('../../pages/Auth/pages/Login/ui/Login'))
const HomePage = lazy(() => import('../../pages/Home/ui/HomePage'))
const PlayPage = lazy(() => import('../../pages/Modpack/pages/play.page'))
const ModpackSettingsPage = lazy(() => import('../../pages/Modpack/pages/Settings/settings.page'))
const SkinsPage = lazy(() => import('../../pages/Modpack/pages/Skins/skins.page'))
const ServersPage = lazy(() => import('../../pages/Modpack/pages/servers.page'))
const LauncherSettingsPage = lazy(
  () => import('../../pages/LauncherSettings/ui/launcher-settings.page')
)

export const routesFreshCraft = createBrowserRouter([
  {
    path: RouteNames.Home,
    errorElement: <ErrorWidget />,
    element: (
      <AuthGuard fallbackRoute={RouteNames.Auth}>
        <HomeLayout Sidebar={MCSidebar} />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        path: RouteNames.Home,
        element: <HomePage />
      },
      {
        path: RouteNames.Modpack,
        element: <ModpackLayout Topbar={MCTopbar} />,
        children: [
          {
            path: RouteNames.Modpack + '/:modpackId',
            element: <Navigate to={RouteNames.ModpackPlay} />
          },
          {
            path: RouteNames.ModpackPlay,
            element: <PlayPage />
          },
          {
            path: RouteNames.ModpackSettings,
            element: <ModpackSettingsPage />
          },
          {
            path: RouteNames.ModpackSkins,
            element: <SkinsPage />
          },
          {
            path: RouteNames.ModpackServers,
            element: <ServersPage />
          }
        ]
      },
      {
        path: RouteNames.Settings,
        element: <LauncherSettingsPage />
      }
    ]
  },
  {
    path: RouteNames.Auth,
    errorElement: <ErrorWidget />,
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
  },
  {
    path: '*',
    element: <Navigate to={RouteNames.Home} />
  }
])
