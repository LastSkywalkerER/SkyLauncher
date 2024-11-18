import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { ProcessProgressData } from '../../../../shared/dtos/process-progress.dto'

export interface IProcessProgress {
  getProgress(): Observable<Record<string, ProcessProgressData>>
}

export namespace IProcessProgress {
  export const $: interfaces.ServiceIdentifier<IProcessProgress> = Symbol('IProcessProgress')
}
