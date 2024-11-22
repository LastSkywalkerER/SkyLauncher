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
