import { useCallback, useState } from 'react'
import { Observable } from 'rxjs'

interface UseObservableRequestResult<T, P extends unknown[]> {
  execute: (...params: P) => void
  data: T | null
  error: Error | null
  isLoading: boolean
  isLoaded: boolean
}

export const useObservableRequest = <P extends unknown[], T>(
  createObservable: (...params: P) => Observable<T>
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

      const observable = createObservable(...params)
      const subscription = observable.subscribe({
        next: (result) => {
          setData(result)
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

      return subscription
    },
    [createObservable]
  )

  return { execute, data, error, isLoading, isLoaded }
}
