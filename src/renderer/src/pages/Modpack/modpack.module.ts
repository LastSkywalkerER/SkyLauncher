import { ContainerModule } from 'inversify'

import { ISkinService, SkinService } from './pages/Skins'

export const ModpackModule = new ContainerModule((bind) => {
  bind<ISkinService>(ISkinService.$).to(SkinService)
})
