import { Global, Module } from '@nestjs/common'

import { FilesystemController } from './filesystem.controller'
import { FilesystemService } from './filesystem.service'

@Global()
@Module({
  providers: [FilesystemService],
  exports: [FilesystemService],
  controllers: [FilesystemController]
})
export class FilesystemModule {}
