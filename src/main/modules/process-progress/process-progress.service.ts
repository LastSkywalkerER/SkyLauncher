import { Injectable } from '@nestjs/common'
import { Window } from '@doubleshot/nest-electron'
import { BrowserWindow } from 'electron'
import { IPCSendNames } from '../../../constants'
import { ProcessProgressData } from '../../../dtos/process-progress.dto'

@Injectable()
export class ProcessProgressService {
  private readonly _progressLog: (data: ProcessProgressData) => void
  private readonly _activeProcessesMap: Record<string, ProcessProgressData> = {}

  constructor(@Window() private readonly mainWindow: BrowserWindow) {
    this._progressLog = (data: ProcessProgressData): void => {
      this.mainWindow.webContents.send(IPCSendNames.ProcessProgress, data)
    }

    this.set = this.set.bind(this)
  }

  public set(data: ProcessProgressData): void {
    console.log(
      `${data.processName}: ${(data.currentValue / (data.maxValue - data.minValue)) * 100}% ${data.status}`
    )
    if (
      this._activeProcessesMap[data.processName] &&
      this._activeProcessesMap[data.processName].status !== 'finished' &&
      data.status === 'started'
    ) {
      throw Error(`Process ${data.processName} already running`)
    }

    this._activeProcessesMap[data.processName] = data
    this._progressLog(data)
  }
}
