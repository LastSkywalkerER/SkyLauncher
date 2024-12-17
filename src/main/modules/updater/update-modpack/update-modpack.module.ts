import { Module } from '@nestjs/common'

import { UpdateModpackHandler } from './update-modpack.handler'

@Module({
  providers: [UpdateModpackHandler]
})
export class UpdateModpackModule {}
