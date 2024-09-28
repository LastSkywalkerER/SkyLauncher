import { Module } from '@nestjs/common'
import { ElectronModule } from '@doubleshot/nest-electron'
import { createWindow } from './utils/window/createWindow'
import { AppController } from './app.controller'
import { LauncherService } from './modules/launcher/launcher.service'

@Module({
  imports: [
    ElectronModule.registerAsync({
      useFactory: async () => ({ win: createWindow() })
    })
  ],
  controllers: [AppController],
  providers: [LauncherService]
})
export class AppModule {}
