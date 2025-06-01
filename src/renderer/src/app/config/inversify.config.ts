import { EntitiesModule } from '@renderer/entities/entities.module'
import { ApiModule } from '@renderer/shared/api'
import { WidgetsModule } from '@renderer/widgets'
import { Container } from 'inversify'

import { ILauncherControlService, LauncherControlService } from '../../features/LaucnherControls'
import { FeatureService, IFeatureService } from '../../features/service'
import { LauncherSettingsModule } from '../../pages/LauncherSettings/services/launcher-settings.module'
import { ModpackModule } from '../../pages/Modpack/modpack.module'

const inversifyContainer = new Container({ defaultScope: 'Singleton' })
inversifyContainer.load(LauncherSettingsModule)
inversifyContainer.load(WidgetsModule)
inversifyContainer.load(ApiModule)
inversifyContainer.load(ModpackModule)
inversifyContainer.load(EntitiesModule)

inversifyContainer
  .bind<ILauncherControlService>(ILauncherControlService.$)
  .to(LauncherControlService)
  .inTransientScope()
inversifyContainer.bind<IFeatureService>(IFeatureService.$).to(FeatureService).inTransientScope()

export { inversifyContainer }
