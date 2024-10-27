import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

export const useObservable = <T,>(observable: Observable<T>, initialValue: T): T => {
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
  }, [])

  return value
}
