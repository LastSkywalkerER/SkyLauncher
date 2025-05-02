import { ContainerModule } from 'inversify'

import { INotificationCenterService, NotificationCenterService } from './NotificationCenter'
import { IProcessProgress, ProcessProgress } from './ProgressBar'
import { ISingleProcessProgress, SingleProcessProgress } from './SingleProgressBar'

export const WidgetsModule = new ContainerModule((bind) => {
  bind<IProcessProgress>(IProcessProgress.$).to(ProcessProgress).inTransientScope()
  bind<ISingleProcessProgress>(ISingleProcessProgress.$)
    .to(SingleProcessProgress)
    .inTransientScope()
  bind<INotificationCenterService>(INotificationCenterService.$)
    .to(NotificationCenterService)
    .inTransientScope()
})
