export enum RouteNames {
  Home = '/',
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
