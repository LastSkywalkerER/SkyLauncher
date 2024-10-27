import { Global, Module } from '@nestjs/common'

import { UserConfigController } from './user-config.controller'
import { UserConfigService } from './user-config.service'

@Global()
@Module({
  providers: [UserConfigService],
  controllers: [UserConfigController],
  exports: [UserConfigService]
})
export class UserConfigModule {}
