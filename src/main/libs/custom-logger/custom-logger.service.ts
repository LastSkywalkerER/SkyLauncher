import { Window } from '@doubleshot/nest-electron'
import { Injectable, LoggerService } from '@nestjs/common'
import { BrowserWindow } from 'electron'
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston'
import * as winston from 'winston'

import { IPCSendNames, launcherName } from '../../../shared/constants'

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly _ipcLogger: (data: unknown[]) => void
  private readonly _winstonLogger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(launcherName, {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true
          })
        )
      })
    ]
  })

  constructor(@Window() private readonly mainWindow: BrowserWindow) {
    this._ipcLogger = (data: unknown[]): void => {
      const concatenatedData = data
        .map((item) => {
          if (typeof item === 'string' || typeof item === 'number') {
            return item
          }

          if (typeof item === 'object' && item !== null) {
            return JSON.stringify(item)
          }

          return item
        })
        .join(' ')

      this.mainWindow.webContents.send(IPCSendNames.UserLog, concatenatedData)
    }
  }

  log(message: any, context?: string) {
    this._ipcLogger([`[LOG]`, message])
    this._winstonLogger.log(message, context)
  }

  error(message: any, trace?: string, context?: string) {
    this._ipcLogger([`[ERROR]`, message, trace])
    this._winstonLogger.error(message, trace, context)
  }

  warn(message: any, context?: string) {
    this._ipcLogger([`[WARN]`, message])
    this._winstonLogger.warn(message, context)
  }

  debug?(message: any, context?: string) {
    this._ipcLogger([`[DEBUG]`, message])
    this._winstonLogger.debug?.(message, context)
  }

  verbose?(message: any, context?: string) {
    this._ipcLogger([`[VERBOSE]`, message])
    this._winstonLogger.verbose?.(message, context)
  }
}
