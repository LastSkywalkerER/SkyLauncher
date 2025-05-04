import { useCallback, useState } from 'react'
import { Observable } from 'rxjs'

interface UseObservableRequestResult<T, P extends unknown[]> {
  execute: (...params: P) => void
  data: T | null
  error: Error | null
  isLoading: boolean
  isLoaded: boolean
}

/**
 * Custom React hook that handles the execution and state management of an RxJS Observable request.
 *
 * @template P - The parameter types for the `createObservable` function.
 * @template T - The type of data emitted by the Observable.
 *
 * @param {(...params: P) => Observable<T>} createObservable - A function that creates an Observable using the provided parameters.
 * @param {P} [commonParams] - Optional predefined parameters that will be used for every request instead of dynamic ones.
 *
 * @returns {{
 *   execute: (...params: P) => Subscription,
 *   data: T | null,
 *   error: Error | null,
 *   isLoading: boolean,
 *   isLoaded: boolean
 * }} An object containing the `execute` function to initiate the request, and state properties for data, error, and loading status.
 *
 * @example
 * const { execute, data, error, isLoading } = useObservableRequest(fetchUserObservable);
 * useEffect(() => {
 *   const subscription = execute(userId);
 *   return () => subscription.unsubscribe();
 * }, [userId]);
 */
export const useObservableRequest = <P extends unknown[], T>(
  createObservable: (...params: P) => Observable<T>,
  commonParams?: P,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    onComplete?: () => void
  }
): UseObservableRequestResult<T, P> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isLoaded, setLoaded] = useState<boolean>(false)

  const execute = useCallback(
    (...params: P) => {
      setLoading(true)
      setLoaded(false)
      setError(null)
      setData(null)

      const observable = createObservable(...(commonParams || params))
      const subscription = observable.subscribe({
        next: (result) => {
          setData(result)
          setLoading(false)
          setLoaded(true)
          options?.onSuccess?.(result)
        },
        error: (err) => {
          setError(err)
          setLoading(false)
          setLoaded(true)
          options?.onError?.(err)
        },
        complete: () => {
          setLoading(false)
          options?.onComplete?.()
        }
      })

      return subscription
    },
    [createObservable]
  )

  return { execute, data, error, isLoading, isLoaded }
}
