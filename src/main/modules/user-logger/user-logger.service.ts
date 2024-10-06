import { Injectable } from '@nestjs/common'
import { Window } from '@doubleshot/nest-electron'
import { BrowserWindow } from 'electron'
import { IPCSendNames } from '../../constants'

@Injectable()
export class UserLoggerService {
  private readonly _logger: (...data: unknown[]) => void

  constructor(@Window() private readonly mainWindow: BrowserWindow) {
    this._logger = (...data: unknown[]): void => {
      const concatenatedData = data
        .map((item) => {
          if (typeof item === 'object' && item !== null) {
            return JSON.stringify(item) // Если объект, сериализуем через JSON.stringify
          }
          return item // Для всех других типов данных, можно вернуть пустую строку или обработать по-другому
        })
        .join(' ') // Соединяем все элементы в одну строку

      this.mainWindow.webContents.send(IPCSendNames.UserLog, concatenatedData)
    }
  }

  public log(...data: unknown[]) {
    this._logger(data)
  }
}
