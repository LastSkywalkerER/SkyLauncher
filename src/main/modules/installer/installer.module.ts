import { Global, Module } from '@nestjs/common'

import { InstallCurseforgeModpackModule } from './install-curseforge-modpack/install-curseforge-modpack.module'
import { InstallForgeModule } from './install-forge/install-forge.module'
import { InstallModpackModule } from './install-modpack/install-modpack.module'
import { InstallNativeModule } from './install-native/install-native.module'
import { InstallerService } from './installer.service'

@Global()
@Module({
  providers: [
    {
      provide: 'CONNECTIONS_AMOUNT',
      useValue: 10
    },
    InstallerService
  ],
  exports: [InstallerService],
  imports: [
    InstallNativeModule,
    InstallForgeModule,
    InstallModpackModule,
    InstallCurseforgeModpackModule
  ]
})
export class InstallerModule {}
