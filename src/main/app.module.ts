import { Module } from '@nestjs/common'
import { ElectronModule } from '@doubleshot/nest-electron'
import { createWindow } from './utils/window/createWindow'
import { LauncherModule } from './modules/launcher/launcher.module'
import { VersionsModule } from './modules/versions/versions.module'
import { AppConfigModule } from './modules/config/config.module'
import { HardwareModule } from './modules/hardware/hardware.module'
import { UserConfigModule } from './modules/user-config/user-config.module'
import { UserLoggerModule } from './modules/user-logger/user-logger.module'
import { ProcessProgressModule } from './modules/process-progress/process-progress.module'

@Module({
  imports: [
    ElectronModule.registerAsync({
      useFactory: async () => ({ win: createWindow() }),
      isGlobal: true
    }),
    LauncherModule,
    VersionsModule,
    AppConfigModule,
    HardwareModule,
    UserConfigModule,
    UserLoggerModule,
    ProcessProgressModule
  ]
})
export class AppModule {}
