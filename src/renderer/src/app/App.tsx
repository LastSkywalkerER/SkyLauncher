import './index.css'
import 'primeicons/primeicons.css'

import { inversifyContainer } from '@renderer/shared/config/inversify.config'
import { routes } from '@renderer/shared/routes/routes'
import { Provider } from 'inversify-react'
import { PrimeReactProvider } from 'primereact/api'
import { FC } from 'react'
import { RouterProvider } from 'react-router-dom'

export const App: FC = () => {
  return (
    <Provider container={inversifyContainer}>
      <PrimeReactProvider>
        <RouterProvider router={routes} />
      </PrimeReactProvider>
    </Provider>
  )
}
