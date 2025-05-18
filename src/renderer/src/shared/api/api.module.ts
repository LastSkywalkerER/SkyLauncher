import { environment } from '@renderer/app/config/environments'
import { ContainerModule } from 'inversify'

import { BackendApi } from './BackendApi'
import { IBackendApi } from './BackendApi/interfaces'
import { AxiosClient } from './HttpClient/AxiosClient'
import { IHttpClient } from './HttpClient/interfaces'
import { IMsalApi, MsalApi } from './MsalApi'
import { NodeApi } from './NodeApi'
import { INodeApi } from './NodeApi/interfaces'

export const ApiModule = new ContainerModule((bind) => {
  bind<IMsalApi>(IMsalApi.$).to(MsalApi)
  bind<INodeApi>(INodeApi.$).to(NodeApi)
  bind<IBackendApi>(IBackendApi.$).to(BackendApi)
  bind<IHttpClient>(IHttpClient.$).toDynamicValue(
    () => new AxiosClient({ baseURL: environment.baseURL })
  )
})
