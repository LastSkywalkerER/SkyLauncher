import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { HttpsUrlDownloaderModule } from '../downloader/https-url-downloader/https-url-downloader.module'
import { JavaService } from './java.service'

@Global()
@Module({
  imports: [HttpsUrlDownloaderModule, ConfigModule],
  providers: [
    {
      provide: 'BASE_URL',
      useFactory: (configService: ConfigService): string =>
        configService.get<string>('javaBaseUrl')!,
      inject: [ConfigService]
    },
    JavaService
  ],
  exports: [JavaService]
})
export class JavaModule {}
