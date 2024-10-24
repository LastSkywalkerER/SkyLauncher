import './index.css'
import 'primeicons/primeicons.css'

import { PrimeReactProvider } from 'primereact/api'
import { routes } from '@renderer/shared/routes/routes'
import { FC } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'inversify-react'
import { inversifyContainer } from '@renderer/shared/config/inversify.config'

export const App: FC = () => {
  return (
    <Provider container={inversifyContainer}>
      <PrimeReactProvider>
        <RouterProvider router={routes} />
      </PrimeReactProvider>
    </Provider>
  )
}
