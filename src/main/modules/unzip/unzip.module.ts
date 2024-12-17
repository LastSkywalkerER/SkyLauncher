import { Global, Module } from '@nestjs/common'

import { UnzipService } from './unzip.service'

@Global()
@Module({
  providers: [UnzipService],
  exports: [UnzipService]
})
export class UnzipModule {}
