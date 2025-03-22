import { inject, injectable } from 'inversify'
import { BehaviorSubject, Observable } from 'rxjs'

import { RendererApi } from '../../../../../shared/api/types'
import { ProcessProgressData } from '../../../../../shared/dtos/process-progress.dto'
import { NodeApi } from '../../../shared/api/NodeApi/index'
import { INodeApi } from '../../../shared/api/NodeApi/interfaces'
import { IProcessProgress } from './interfaces'

@injectable()
export class ProcessProgress implements IProcessProgress {
  private readonly _processes: BehaviorSubject<Record<string, ProcessProgressData>> =
    new BehaviorSubject({})
  private _nodeApi: RendererApi

  constructor(@inject(INodeApi.$) nodeApi: NodeApi) {
    this._nodeApi = nodeApi.getMainProcessApi()

    this._subscribe()

    this.getProgress = this.getProgress.bind(this)
  }

  private _subscribe(): void {
    this._nodeApi.subscripbeOnProgress(async (data) => {
      const prevValue = this._processes.getValue()

      const filteredPrevValues = Object.values(prevValue)
        .filter(({ status }) => status !== 'finished')
        .reduce((acc, data) => ({ ...acc, [data.processName]: data }), {})

      this._processes.next({ ...filteredPrevValues, [data.processName]: data })

      if (data.status === 'finished') {
        await new Promise((resolve) =>
          setTimeout(() => resolve(this.filterFinishedProcesses()), 100)
        )
      }
    })
  }

  private filterFinishedProcesses(): void {
    const values = this._processes.getValue()

    const filteredValues = Object.values(values)
      .filter(({ status }) => status !== 'finished')
      .reduce((acc, data) => ({ ...acc, [data.processName]: data }), {})

    this._processes.next(filteredValues)
  }

  public getProgress(): Observable<Record<string, ProcessProgressData>> {
    return this._processes
  }
}
