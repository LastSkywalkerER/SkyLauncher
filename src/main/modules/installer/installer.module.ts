import { Global, Module } from '@nestjs/common'

import { XmclCoreModule } from '../../libs/xmcl-core/xmcl-core.module'
import { InstallCurseforgeModpackModule } from './install-curseforge-modpack/install-curseforge-modpack.module'
import { InstallForgeModule } from './install-forge/install-forge.module'
import { InstallModpackModule } from './install-modpack/install-modpack.module'
import { InstallNativeModule } from './install-native/install-native.module'

@Global()
@Module({
  imports: [
    XmclCoreModule,
    InstallNativeModule,
    InstallForgeModule,
    InstallModpackModule,
    InstallCurseforgeModpackModule
  ]
})
export class InstallerModule {}
