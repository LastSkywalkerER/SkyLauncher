import { ILoadableState } from '@renderer/entities/LoadableState/interfaces'
import { interfaces } from 'inversify'

import { ProcessProgressData } from '../../../../../shared/dtos/process-progress.dto'

export interface ISingleProcessProgress extends ILoadableState<ProcessProgressData> {
  getActiveProcesses(): ProcessProgressData | null
}

export namespace ISingleProcessProgress {
  export const $: interfaces.ServiceIdentifier<ISingleProcessProgress> =
    Symbol('ISingleProcessProgress')
}
