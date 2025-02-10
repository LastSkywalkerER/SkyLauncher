import { Global, Module } from '@nestjs/common'

import { HttpsUrlDownloaderModule } from '../../libs/downloader/https-url-downloader/https-url-downloader.module'
import { MetadataService } from './metadata.service'

@Global()
@Module({
  imports: [HttpsUrlDownloaderModule],
  providers: [MetadataService],
  exports: [MetadataService]
})
export class MetadataModule {}
