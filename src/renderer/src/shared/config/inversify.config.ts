import { NodeApi } from '@renderer/entities/NodeApi'
import { INodeApi } from '@renderer/entities/NodeApi/interfaces'
import { Settings } from '@renderer/entities/Settings'
import { ISettings } from '@renderer/entities/Settings/interfaces'
import { Container } from 'inversify'

import { BackendApi } from '../../entities/BackendApi'
import { IBackendApi } from '../../entities/BackendApi/interfaces'
import { AxiosClient } from '../../entities/HttpClient/AxiosClient'
import { IHttpClient } from '../../entities/HttpClient/interfaces'
import { ProcessProgress } from '../../entities/ProcessProgress'
import { IProcessProgress } from '../../entities/ProcessProgress/interfaces'
import { User } from '../../entities/User'
import { IUser } from '../../entities/User/interfaces'
import { Versions } from '../../entities/Versions'
import { IVersions } from '../../entities/Versions/interfaces'
import { environment } from './environments'

const inversifyContainer = new Container({ defaultScope: 'Singleton' })
inversifyContainer.bind<INodeApi>(INodeApi.$).to(NodeApi)
inversifyContainer.bind<ISettings>(ISettings.$).to(Settings)
inversifyContainer.bind<IProcessProgress>(IProcessProgress.$).to(ProcessProgress)
inversifyContainer.bind<IVersions>(IVersions.$).to(Versions)
inversifyContainer.bind<IUser>(IUser.$).to(User)
inversifyContainer.bind<IBackendApi>(IBackendApi.$).to(BackendApi)
inversifyContainer
  .bind<IHttpClient>(IHttpClient.$)
  .toDynamicValue(() => new AxiosClient({ baseURL: environment.baseURL }))

export { inversifyContainer }
