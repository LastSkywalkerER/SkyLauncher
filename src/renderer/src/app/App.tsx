import './index.css'
import 'primeicons/primeicons.css'
import './config/i18n.config'

import { Provider } from 'inversify-react'
import { PrimeReactProvider } from 'primereact/api'
import { FC } from 'react'
import { RouterProvider } from 'react-router-dom'

import { environment } from './config/environments'
import { inversifyContainer } from './config/inversify.config'
import { routes } from './routes/routes'
import { routesFreshCraft } from './routes/routesFreshCraft'

export const App: FC = () => {
  return (
    <Provider container={inversifyContainer}>
      <PrimeReactProvider>
        <RouterProvider router={environment.uiType === 'fresh-craft' ? routesFreshCraft : routes} />
        {/* <RouterProvider router={routesFreshCraft} /> */}
      </PrimeReactProvider>
    </Provider>
  )
}
