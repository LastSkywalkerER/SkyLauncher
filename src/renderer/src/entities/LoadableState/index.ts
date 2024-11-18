import { injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'

import { ILoadableState } from './interfaces'

@injectable()
export class LoadableState<T = unknown> implements ILoadableState<T> {
  data$ = new BehaviorSubject<T | null>(null)
  isLoaded$ = new BehaviorSubject(false)
  isLoading$ = new BehaviorSubject(true)
}
