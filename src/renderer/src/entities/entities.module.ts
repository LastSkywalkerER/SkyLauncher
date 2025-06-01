import { ContainerModule } from 'inversify'

import { ILauncherInfo, LauncherInfoService } from './LauncherInfo'
import { Settings } from './Settings'
import { ISettings } from './Settings/interfaces'
import { IUser, User } from './User'
import { Versions } from './Versions'
import { IVersions } from './Versions/interfaces'

export const EntitiesModule = new ContainerModule((bind) => {
  bind<ISettings>(ISettings.$).to(Settings)
  bind<IVersions>(IVersions.$).to(Versions)
  bind<IUser>(IUser.$).to(User)
  bind<ILauncherInfo>(ILauncherInfo.$).to(LauncherInfoService)
})
