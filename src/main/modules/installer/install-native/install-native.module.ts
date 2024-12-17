import { Module } from '@nestjs/common'

import { InstallNativeHandler } from './install-native.handler'

@Module({
  providers: [InstallNativeHandler]
})
export class InstallNativeModule {}
