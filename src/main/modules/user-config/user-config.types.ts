import { defaults } from './user-config.schema'

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never

// Рекурсивный тип для получения всех ключей объекта
type Paths<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? Join<K, Paths<T[K]>> : K
    }[keyof T]
  : never

// Получаем все ключи объекта defaults
export type ConfigKeys = Paths<typeof defaults>
