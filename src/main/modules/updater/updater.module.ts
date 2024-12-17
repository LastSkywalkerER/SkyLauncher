import { Module } from '@nestjs/common'

import { UpdateModpackModule } from './update-modpack/update-modpack.module'

@Module({
  imports: [UpdateModpackModule]
})
export class UpdaterModule {}
