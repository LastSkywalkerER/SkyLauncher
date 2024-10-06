import { Global, Module } from '@nestjs/common'
import { UserConfigService } from './user-config.service'
import { UserConfigController } from './user-config.controller'

@Global()
@Module({
  providers: [UserConfigService],
  controllers: [UserConfigController],
  exports: [UserConfigService]
})
export class UserConfigModule {}
