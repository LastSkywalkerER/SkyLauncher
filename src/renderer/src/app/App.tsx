import './index.css'

import { PrimeReactProvider } from 'primereact/api'
import { routes } from '@renderer/shared/routes/routes'
import { FC, Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'inversify-react'
import { inversifyContainer } from '@renderer/shared/config/inversify.config'

export const App: FC = () => {
  return (
    <Provider container={inversifyContainer}>
      <PrimeReactProvider>
        <Suspense>
          <RouterProvider router={routes} />
        </Suspense>
      </PrimeReactProvider>
    </Provider>
  )
}
