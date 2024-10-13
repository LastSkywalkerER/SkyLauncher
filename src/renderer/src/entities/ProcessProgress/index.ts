import { inject, injectable } from 'inversify'
import { BehaviorSubject, Observable } from 'rxjs'
import { RendererApi } from '../../../../api/types'
import { ProcessProgressData } from '../../../../dtos/process-progress.dto'
import { NodeApi } from '../NodeApi'
import { INodeApi } from '../NodeApi/interfaces'
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
    this._nodeApi.subscripbeOnProgress((data) => {
      const prevValue = this._processes.getValue()

      const filteredPrevValue = Object.values(prevValue)
        .filter(({ status }) => status !== 'finished')
        .reduce((acc, data) => ({ ...acc, [data.processName]: data }), {})

      this._processes.next({ ...filteredPrevValue, [data.processName]: data })
    })
  }

  public getProgress(): Observable<Record<string, ProcessProgressData>> {
    return this._processes
  }
}
