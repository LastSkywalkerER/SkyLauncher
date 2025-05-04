import { interfaces } from 'inversify'
import { Observable } from 'rxjs'

import { ProcessProgressData } from '../../../../../shared/dtos/process-progress.dto'

export interface INotificationCenterService {
  getProgress(): Observable<Record<string, ProcessProgressData>>
}

export namespace INotificationCenterService {
  export const $: interfaces.ServiceIdentifier<INotificationCenterService> = Symbol(
    'INotificationCenterService'
  )
}
