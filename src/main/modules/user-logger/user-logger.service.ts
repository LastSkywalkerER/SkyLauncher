import { Injectable } from '@nestjs/common'
import { Window } from '@doubleshot/nest-electron'
import { BrowserWindow } from 'electron'
import { IPCSendNames } from '../../../constants'

@Injectable()
export class UserLoggerService {
  private readonly _logger: (data: unknown[]) => void

  constructor(@Window() private readonly mainWindow: BrowserWindow) {
    this._logger = (data: unknown[]): void => {
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

    this.log = this.log.bind(this)
    this.info = this.info.bind(this)
    this.error = this.error.bind(this)
  }

  public log(...data: unknown[]): void {
    this._logger(data)
  }

  public info(...data: unknown[]): void {
    this._logger(data)
  }

  public error(...data: unknown[]): void {
    this._logger(data)
  }
}
