import { interfaces } from 'inversify'
import { useInjection } from 'inversify-react'

import { ILoadableState } from '../../entities/LoadableState/interfaces'
import { useObservable } from './useObservable' // путь к вашему хуку useObservable

export interface LoadebleStateProps<T extends ILoadableState<K>, K> {
  data: K | null
  isLoaded: boolean
  isLoading: boolean
  instance: T
  error: Error | null
}

/**
 * Custom React hook for working with a loadable state service that exposes reactive properties via RxJS observables.
 * Automatically subscribes to the service's observable fields and returns their current values.
 *
 * @template T - The type of the loadable state service, extending `ILoadableState`.
 * @template K - The type of the data held within the loadable state.
 *
 * @param {interfaces.ServiceIdentifier<T>} identifier - The InversifyJS service identifier used to resolve the loadable state instance.
 *
 * @returns {LoadebleStateProps<T, K>} An object containing:
 * - `data`: The latest value emitted by the `data$` observable.
 * - `isLoaded`: Whether the data has been successfully loaded.
 * - `isLoading`: Whether the loading process is ongoing.
 * - `error`: Any error encountered during the loading process.
 * - `instance`: The resolved loadable state instance for calling its methods directly if needed.
 *
 * @example
 * const { data, isLoaded, isLoading, error, instance } = useLoadableState(UserState);
 *
 * useEffect(() => {
 *   if (!isLoaded && !isLoading) {
 *     instance.loadUser(userId);
 *   }
 * }, [isLoaded, isLoading]);
 */
export const useLoadableState = <T extends ILoadableState<K>, K>(
  identifier: interfaces.ServiceIdentifier<T>
): LoadebleStateProps<T, K> => {
  // Получаем экземпляр LoadableState с помощью useInjection
  const instance = useInjection<T>(identifier)

  // Используем useObservable для отслеживания значений BehaviorSubject
  const data = useObservable(instance.data$, null)
  const isLoaded = useObservable(instance.isLoaded$, false)
  const isLoading = useObservable(instance.isLoading$, true)
  const error = useObservable(instance.error$, null)

  // Возвращаем значения полей и сам экземпляр LoadableState для доступа к методам
  return {
    data,
    isLoaded,
    isLoading,
    instance, // возвращаем также сам экземпляр, если нужно вызывать его методы
    error
  }
}
