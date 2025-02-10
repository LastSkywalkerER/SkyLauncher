import { v4 as uuidv4 } from 'uuid'

import { ProcessProgressData } from '../../../shared/dtos/process-progress.dto'

export class ProcessProgress {
  private readonly _progressLog: (data: ProcessProgressData) => void

  private _data: ProcessProgressData

  constructor(_progressLog: (data: ProcessProgressData) => void) {
    this._progressLog = _progressLog

    this.set = this.set.bind(this)

    this._data = {
      id: uuidv4(),
      maxValue: 0,
      status: 'inited',
      currentValue: 0,
      minValue: 0,
      unit: '',
      processName: ''
    }
  }

  public init(data: Partial<ProcessProgressData>): void {
    this._data = { ...this._data, ...data }
  }

  public get(): ProcessProgressData {
    return this._data
  }

  public set(data: Partial<ProcessProgressData>, options?: { additionalValue?: number }): void {
    this._data = {
      ...this._data,
      ...data,
      currentValue: data.currentValue
        ? data.currentValue
        : options?.additionalValue
          ? this._data.currentValue + options?.additionalValue
          : this._data.currentValue
    }

    this._progressLog(this._data)
  }
}
