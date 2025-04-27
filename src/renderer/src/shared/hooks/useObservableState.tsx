import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

interface UseObservableStateResult<T> {
  data: T
  error: Error | null
  isLoading: boolean
  isLoaded: boolean
}

/**
 * Custom React hook that subscribes to an RxJS Observable and manages loading, error, and data states.
 * Automatically updates the states on each emission and unsubscribes on component unmount.
 *
 * @template T - The type of value emitted by the observable.
 *
 * @param {Observable<T>} observable - The RxJS Observable to subscribe to.
 * @param {T} [initialValue=null] - The initial value to use before the first emission.
 * @param {unknown[]} [deps=[]] - Dependencies array for the useEffect hook.
 *
 * @returns {UseObservableStateResult<T>} An object containing:
 * - `data`: The latest value emitted by the observable.
 * - `error`: Any error encountered during subscription.
 * - `isLoading`: Whether the observable is currently emitting values.
 * - `isLoaded`: Whether the observable has completed at least one emission.
 *
 * @example
 * const { data, error, isLoading, isLoaded } = useObservableState(someObservable$);
 */
export const useObservableState = <T,>(
  observable: Observable<T>,
  initialValue: T,
  deps: unknown[] = []
): UseObservableStateResult<T> => {
  const [data, setData] = useState<T>(initialValue)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isLoaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    setLoaded(false)
    setError(null)

    const subscription = observable.subscribe({
      next: (value) => {
        setData(value)
        setLoading(false)
        setLoaded(true)
      },
      error: (err) => {
        setError(err)
        setLoading(false)
        setLoaded(true)
      },
      complete: () => {
        setLoading(false)
      }
    })

    return (): void => {
      subscription.unsubscribe()
    }
  }, deps)

  return { data, error, isLoading, isLoaded }
}
