import type { interfaces } from 'inversify'
import { useEffect, useRef } from 'react'

import { inversifyContainer } from '../../app/config/inversify.config'

export const useTransientInjection = <T>(identifier: interfaces.ServiceIdentifier<T>): T => {
  const ref = useRef<T | null>(null)

  if (ref.current === null) {
    try {
      const instance = inversifyContainer.get<T>(identifier)
      if (!instance) throw new Error(`No binding found for ${identifier.toString()}`)
      ref.current = instance
    } catch (e) {
      console.error(`useTransientInjection error for ${identifier.toString()}`, e)
      throw e
    }
  }

  useEffect(() => {
    return () => {
      const destroyable = ref.current as any
      destroyable?.destroy?.()
      ref.current = null
    }
  }, [])

  if (!ref.current) {
    throw new Error('Service instance is undefined')
  }

  return ref.current
}
