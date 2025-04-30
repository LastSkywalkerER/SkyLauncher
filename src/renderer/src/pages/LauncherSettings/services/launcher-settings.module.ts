import { ContainerModule } from 'inversify'

import { ILauncherSettingsService } from './interfaces'
import { LauncherSettingsService } from './launcher-settings.service'

export const LauncherSettingsModule = new ContainerModule((bind) => {
  bind<ILauncherSettingsService>(ILauncherSettingsService.$).to(LauncherSettingsService)
})
