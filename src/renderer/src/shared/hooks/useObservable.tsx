import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

/**
 * Custom React hook that subscribes to an RxJS Observable and keeps its latest emitted value in React state.
 * Automatically updates the state on each emission and unsubscribes on component unmount.
 *
 * @template T - The type of value emitted by the observable.
 *
 * @param {Observable<T>} observable - The RxJS Observable to subscribe to.
 * @param {T} initialValue - The initial value to use before the first emission.
 *
 * @returns {T} The latest value emitted by the observable.
 *
 * @example
 * const value = useObservable(someObservable$, 0);
 */
export const useObservable = <T,>(
  observable: Observable<T>,
  initialValue: T,
  deps: unknown[] = []
): T => {
  // Создаем состояние с начальным значением
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    // Подписываемся на Observable и обновляем состояние при каждом эмиссии
    const subscription = observable.subscribe({
      next: setValue, // Обновляем состояние
      error: (err) => console.error('Observable error: ', err) // Обрабатываем ошибку
    })

    // Освобождаем ресурсы при размонтировании
    return (): void => {
      subscription.unsubscribe()
    }
  }, deps)

  return value
}
