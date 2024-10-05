import { Module } from '@nestjs/common'
import { ElectronModule } from '@doubleshot/nest-electron'
import { createWindow } from './utils/window/createWindow'
import { LauncherModule } from './modules/launcher/launcher.module'
import { VersionsModule } from './modules/versions/versions.module'
import { AppConfigModule } from './modules/config/config.module'
import { HardwareModule } from './modules/hardware/hardware.module'

@Module({
  imports: [
    ElectronModule.registerAsync({
      useFactory: async () => ({ win: createWindow() }),
      isGlobal: true
    }),
    LauncherModule,
    VersionsModule,
    AppConfigModule,
    HardwareModule
  ]
})
export class AppModule {}
