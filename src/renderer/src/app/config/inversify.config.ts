import { ApiModule } from '@renderer/shared/api'
import { WidgetsModule } from '@renderer/widgets'
import { Container } from 'inversify'

import { Settings } from '../../entities/Settings/index'
import { ISettings } from '../../entities/Settings/interfaces'
import { User } from '../../entities/User/index'
import { IUser } from '../../entities/User/interfaces'
import { Versions } from '../../entities/Versions'
import { IVersions } from '../../entities/Versions/interfaces'
import { ILauncherControlService, LauncherControlService } from '../../features/LaucnherControls'
import { FeatureService, IFeatureService } from '../../features/service'
import { LauncherSettingsModule } from '../../pages/LauncherSettings/services/launcher-settings.module'

const inversifyContainer = new Container({ defaultScope: 'Singleton' })
inversifyContainer.load(LauncherSettingsModule)
inversifyContainer.load(WidgetsModule)
inversifyContainer.load(ApiModule)

inversifyContainer.bind<ISettings>(ISettings.$).to(Settings)
inversifyContainer.bind<IVersions>(IVersions.$).to(Versions)
inversifyContainer.bind<IUser>(IUser.$).to(User)

inversifyContainer
  .bind<ILauncherControlService>(ILauncherControlService.$)
  .to(LauncherControlService)
  .inTransientScope()
inversifyContainer.bind<IFeatureService>(IFeatureService.$).to(FeatureService).inTransientScope()

export { inversifyContainer }
