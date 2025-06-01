import { Global, Module } from '@nestjs/common'

import { WindowService } from './window.service'

@Global()
@Module({
  providers: [WindowService],
  exports: [WindowService]
})
export class WindowModule {}
