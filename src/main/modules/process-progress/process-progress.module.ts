import { Global, Module } from '@nestjs/common'
import { ProcessProgressService } from './process-progress.service'

@Global()
@Module({
  providers: [ProcessProgressService],
  exports: [ProcessProgressService]
})
export class ProcessProgressModule {}
