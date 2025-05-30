import { Window } from '@doubleshot/nest-electron'
import { Injectable } from '@nestjs/common'
import { BrowserWindow } from 'electron'

import { IPCSendNames } from '../../../shared/constants'
import { ProcessProgressData } from '../../../shared/dtos/process-progress.dto'
import { ProcessProgress } from './process-progress'

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

  public getLogger(): ProcessProgress {
    return new ProcessProgress((data: ProcessProgressData): void => {
      this.mainWindow.webContents.send(IPCSendNames.ProcessProgress, data)
    })
  }
}
