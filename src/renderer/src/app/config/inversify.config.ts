import { Container } from 'inversify'

import { Settings } from '../../entities/Settings/index'
import { ISettings } from '../../entities/Settings/interfaces'
import { User } from '../../entities/User/index'
import { IUser } from '../../entities/User/interfaces'
import { Versions } from '../../entities/Versions'
import { IVersions } from '../../entities/Versions/interfaces'
import { ILauncherControlService, LauncherControlService } from '../../features/LaucnherControls'
import { FeatureService, IFeatureService } from '../../features/service'
import { BackendApi } from '../../shared/api/BackendApi/index'
import { IBackendApi } from '../../shared/api/BackendApi/interfaces'
import { AxiosClient } from '../../shared/api/HttpClient/AxiosClient'
import { IHttpClient } from '../../shared/api/HttpClient/interfaces'
import { NodeApi } from '../../shared/api/NodeApi/index'
import { INodeApi } from '../../shared/api/NodeApi/interfaces'
import { ProcessProgress } from '../../widgets/ProgressBar/service/index'
import { IProcessProgress } from '../../widgets/ProgressBar/service/interfaces'
import { environment } from './environments'

const inversifyContainer = new Container({ defaultScope: 'Singleton' })
inversifyContainer.bind<INodeApi>(INodeApi.$).to(NodeApi)
inversifyContainer.bind<ISettings>(ISettings.$).to(Settings)
inversifyContainer.bind<IVersions>(IVersions.$).to(Versions)
inversifyContainer.bind<IUser>(IUser.$).to(User)
inversifyContainer.bind<IBackendApi>(IBackendApi.$).to(BackendApi)
inversifyContainer
  .bind<IHttpClient>(IHttpClient.$)
  .toDynamicValue(() => new AxiosClient({ baseURL: environment.baseURL }))

inversifyContainer.bind<IProcessProgress>(IProcessProgress.$).to(ProcessProgress).inTransientScope()
inversifyContainer
  .bind<ILauncherControlService>(ILauncherControlService.$)
  .to(LauncherControlService)
  .inTransientScope()
inversifyContainer.bind<IFeatureService>(IFeatureService.$).to(FeatureService).inTransientScope()

export { inversifyContainer }
