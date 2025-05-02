import { LoadableState } from '@renderer/entities/LoadableState'
import { inject, injectable } from 'inversify'
import { RendererApi } from 'src/shared/api/types'

import { ProcessProgressData } from '../../../../../shared/dtos/process-progress.dto'
import { NodeApi } from '../../../shared/api/NodeApi/index'
import { INodeApi } from '../../../shared/api/NodeApi/interfaces'
import { ISingleProcessProgress } from './interfaces'

@injectable()
export class SingleProcessProgress
  extends LoadableState<ProcessProgressData>
  implements ISingleProcessProgress
{
  private _nodeApi: RendererApi
  private _activeProcesses: Record<string, ProcessProgressData> = {}

  constructor(@inject(INodeApi.$) nodeApi: NodeApi) {
    super()

    this._nodeApi = nodeApi.getMainProcessApi()

    this._subscribe()

    this.getActiveProcesses = this.getActiveProcesses.bind(this)
  }

  private _subscribe(): void {
    this._nodeApi.subscripbeOnProgress(async (data) => {
      const currentProcess = this.data$.getValue()
      const isOldProcess = !!this._activeProcesses[data.id]
      const isProcessFinished = data.status === 'finished' || data.status === 'failed'
      const isProcessStarted = data.status === 'started'
      const isProcessInProgress = data.status === 'inProgress'

      console.log({
        data,
        currentProcess,
        isOldProcess,
        isProcessFinished,
        isProcessStarted,
        isProcessInProgress
      })

      if (isProcessStarted && !isOldProcess) {
        this._activeProcesses[data.id] = data
      }

      if (isProcessInProgress && isOldProcess) {
        this._activeProcesses[data.id] = data
      }

      if (isProcessFinished && isOldProcess) {
        delete this._activeProcesses[data.id]
      }

      const accumulatedData = Object.values(this._activeProcesses).reduce(
        (acc, curr) => {
          return {
            minValue: acc.minValue + curr.minValue,
            maxValue: acc.maxValue + curr.maxValue,
            currentValue: acc.currentValue + curr.currentValue
          }
        },
        { minValue: 0, maxValue: 0, currentValue: 0 }
      )

      console.log({ accumulatedData })

      this.data$.next({
        id: currentProcess?.id || data.id,
        minValue: accumulatedData.minValue,
        maxValue: accumulatedData.maxValue,
        currentValue: accumulatedData.currentValue,
        unit: currentProcess?.unit || data.unit,
        processName: currentProcess?.processName || data.processName,
        status: Object.keys(this._activeProcesses).length ? 'inProgress' : 'finished'
      })

      if (isProcessFinished && isOldProcess && !Object.keys(this._activeProcesses).length) {
        this.data$.next(null)
      }
    })
  }

  public getActiveProcesses(): ProcessProgressData | null {
    return this.data$.getValue()
  }
}
