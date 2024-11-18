import { BehaviorSubject } from 'rxjs'

export interface ILoadableState<T> {
  data$: BehaviorSubject<T | null>
  isLoaded$: BehaviorSubject<boolean>
  isLoading$: BehaviorSubject<boolean>
}
