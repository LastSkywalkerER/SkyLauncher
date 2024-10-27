import { Global, Module } from '@nestjs/common'

import { UserLoggerService } from './user-logger.service'

@Global()
@Module({
  providers: [UserLoggerService],
  exports: [UserLoggerService]
})
export class UserLoggerModule {}
