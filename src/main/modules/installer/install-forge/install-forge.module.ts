import { Module } from '@nestjs/common'

import { InstallForgeHandler } from './install-forge.handler'

@Module({
  providers: [InstallForgeHandler]
})
export class InstallForgeModule {}
