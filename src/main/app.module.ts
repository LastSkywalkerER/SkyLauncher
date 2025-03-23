import { ElectronModule } from '@doubleshot/nest-electron'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AppConfigModule } from './libs/config/config.module'
import { CustomLoggerModule } from './libs/custom-logger/custom-logger.module'
import { HardwareModule } from './libs/hardware/hardware.module'
import { JavaModule } from './libs/java/java.module'
import { ProcessProgressModule } from './libs/process-progress/process-progress.module'
import { UnzipModule } from './libs/unzip/unzip.module'
import { XmclCoreModule } from './libs/xmcl-core/xmcl-core.module'
import { FilesystemModule } from './modules/filesystem/filesystem.module'
import { InstallerModule } from './modules/installer/installer.module'
import { LauncherModule } from './modules/launcher/launcher.module'
import { MetadataModule } from './modules/metadata/metadata.module'
import { RequestsModule } from './modules/requests/requests.module'
import { UpdaterModule } from './modules/updater/updater.module'
import { UserConfigModule } from './modules/user-config/user-config.module'
import { VersionsModule } from './modules/versions/versions.module'
import { createWindow } from './utils/window/createWindow'

@Module({
  imports: [
    ElectronModule.registerAsync({
      useFactory: async () => ({ win: createWindow() }),
      isGlobal: true
    }),
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.ms(),
    //         nestWinstonModuleUtilities.format.nestLike('MyApp', {
    //           colors: true,
    //           prettyPrint: true,
    //           processId: true,
    //           appName: true
    //         })
    //       )
    //     }),
    //     new WinstonTransportService({
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.ms(),
    //         nestWinstonModuleUtilities.format.nestLike('Test', {
    //           colors: true,
    //           prettyPrint: true,
    //           processId: true,
    //           appName: true
    //         })
    //       )
    //     })
    //   ]
    // }),
    LauncherModule,
    VersionsModule,
    AppConfigModule,
    HardwareModule,
    UserConfigModule,
    ProcessProgressModule,
    RequestsModule,
    InstallerModule,
    UnzipModule,
    MetadataModule,
    JavaModule,
    CqrsModule.forRoot(),
    FilesystemModule,
    UpdaterModule,
    CustomLoggerModule,
    XmclCoreModule
  ]
})
export class AppModule {}
