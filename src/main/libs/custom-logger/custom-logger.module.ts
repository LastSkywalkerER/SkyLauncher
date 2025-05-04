import { join } from 'node:path'

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { app } from 'electron'

import { launcherName } from '../../../shared/constants'
import { CustomLoggerService } from './custom-logger.service'

@Module({
  providers: [
    {
      provide: 'LOG_DIR',
      useFactory: (configService: ConfigService): string =>
        configService.get<string>('isDev')!
          ? 'logs/complete.log'
          : join(app.getPath('appData'), launcherName, 'logs', 'complete.log'),
      inject: [ConfigService]
    },
    CustomLoggerService
  ]
})
export class CustomLoggerModule {}
