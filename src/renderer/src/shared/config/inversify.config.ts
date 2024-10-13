import { Container } from 'inversify'
import { INodeApi } from '@renderer/entities/NodeApi/interfaces'
import { NodeApi } from '@renderer/entities/NodeApi'
import { ISettings } from '@renderer/entities/Settings/interfaces'
import { Settings } from '@renderer/entities/Settings'
import { ProcessProgress } from '../../entities/ProcessProgress'
import { IProcessProgress } from '../../entities/ProcessProgress/interfaces'
import { Versions } from '../../entities/Versions'
import { IVersions } from '../../entities/Versions/interfaces'

const inversifyContainer = new Container({ defaultScope: 'Singleton' })
inversifyContainer.bind<INodeApi>(INodeApi.$).to(NodeApi)
inversifyContainer.bind<ISettings>(ISettings.$).to(Settings)
inversifyContainer.bind<IProcessProgress>(IProcessProgress.$).to(ProcessProgress)
inversifyContainer.bind<IVersions>(IVersions.$).to(Versions)

export { inversifyContainer }
