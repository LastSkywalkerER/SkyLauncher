import { Module } from '@nestjs/common'

import { LaunchModpackHandler } from './launch-modpack.handler'

@Module({
  providers: [LaunchModpackHandler]
})
export class LaunchModpackModule {}
