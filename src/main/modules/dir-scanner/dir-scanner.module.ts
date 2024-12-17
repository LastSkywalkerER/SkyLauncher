import { Global, Module } from '@nestjs/common'

import { DirScannerService } from './dir-scanner.service'

@Global()
@Module({
  providers: [DirScannerService],
  exports: [DirScannerService]
})
export class DirScannerModule {}
