import { ElectronModule } from '@doubleshot/nest-electron'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AppConfigModule } from './modules/config/config.module'
import { DirScannerModule } from './modules/dir-scanner/dir-scanner.module'
import { HardwareModule } from './modules/hardware/hardware.module'
import { InstallerModule } from './modules/installer/installer.module'
import { JavaModule } from './modules/java/java.module'
import { LauncherModule } from './modules/launcher/launcher.module'
import { MetadataModule } from './modules/metadata/metadata.module'
import { ProcessProgressModule } from './modules/process-progress/process-progress.module'
import { RequestsModule } from './modules/requests/requests.module'
import { UnzipModule } from './modules/unzip/unzip.module'
import { UpdaterModule } from './modules/updater/updater.module'
import { UserConfigModule } from './modules/user-config/user-config.module'
import { UserLoggerModule } from './modules/user-logger/user-logger.module'
import { VersionsModule } from './modules/versions/versions.module'
import { createWindow } from './utils/window/createWindow'

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
    ProcessProgressModule,
    RequestsModule,
    InstallerModule,
    UnzipModule,
    MetadataModule,
    JavaModule,
    CqrsModule.forRoot(),
    DirScannerModule,
    UpdaterModule
  ]
})
export class AppModule {}
