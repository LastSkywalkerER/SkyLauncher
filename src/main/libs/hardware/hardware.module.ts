import { Global, Module } from '@nestjs/common'

import { HardwareService } from './hardware.service'

@Global()
@Module({
  providers: [HardwareService],
  exports: [HardwareService]
})
export class HardwareModule {}
