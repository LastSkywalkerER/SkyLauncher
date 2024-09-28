import { Container } from 'inversify'
import { INodeApi } from '@renderer/entities/NodeApi/interfaces'
import { NodeApi } from '@renderer/entities/NodeApi'
import { ISettings } from '@renderer/entities/Settings/interfaces'
import { Settings } from '@renderer/entities/Settings'

const inversifyContainer = new Container({ defaultScope: 'Singleton' })
inversifyContainer.bind<INodeApi>(INodeApi.$).to(NodeApi)
inversifyContainer.bind<ISettings>(ISettings.$).to(Settings)

export { inversifyContainer }
