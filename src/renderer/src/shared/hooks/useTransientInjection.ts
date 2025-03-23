import type { interfaces } from 'inversify'
import { useEffect, useRef } from 'react'

import { inversifyContainer } from '../../app/config/inversify.config'

/**
 * Custom React hook that retrieves a transient service instance from an InversifyJS container.
 * The instance is created on first render and destroyed on component unmount if it has a `destroy` method.
 *
 * @template T - The type of the service to inject.
 * @param {interfaces.ServiceIdentifier<T>} identifier - The InversifyJS service identifier used to resolve the dependency.
 *
 * @returns {T} The resolved service instance.
 *
 * @throws Will throw an error if the service cannot be resolved from the container or is undefined after resolution.
 *
 * @example
 * const myService = useTransientInjection(MyService);
 *
 * // Service must be registered in the container:
 * container.bind(MyService).toSelf().inTransientScope();
 */
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
