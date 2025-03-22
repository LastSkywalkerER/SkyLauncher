export enum RouteNames {
  Home = '/',
  Register = '/register',
  Login = '/login',
  OfflineLogin = '/offline-login',
  CheckMinecraftProfile = '/check-minecraft-profile',
  Settings = '/settings',
  Logs = '/logs',
  AvailableVersions = '/available-versions'
}

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
