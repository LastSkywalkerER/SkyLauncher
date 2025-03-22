import './index.css'
import 'primeicons/primeicons.css'

import { Provider } from 'inversify-react'
import { PrimeReactProvider } from 'primereact/api'
import { FC } from 'react'
import { RouterProvider } from 'react-router-dom'

import { inversifyContainer } from './config/inversify.config'
import { routes } from './routes/routes'

export const App: FC = () => {
  return (
    <Provider container={inversifyContainer}>
      <PrimeReactProvider>
        <RouterProvider router={routes} />
      </PrimeReactProvider>
    </Provider>
  )
}
