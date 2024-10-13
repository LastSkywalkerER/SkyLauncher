export type UserConfigData = {
  user?: {
    name?: string
    id?: string
  }
  directoriesPaths?: {
    java?: string
    modpacks?: string
  }
  javaArgs?: {
    minMemory?: number
    maxMemory?: number
    version?: number
  }
  resolution?: {
    width?: number
    height?: number
    fullscreen?: boolean
  }
}

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
export type ConfigKeys = Paths<UserConfigData>

// Тип для получения значения по ключу в объекте
export type ValueOfPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Paths<T[K]>
      ? ValueOfPath<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never
