import { Inject, Injectable } from '@nestjs/common'
import { Client } from 'minio'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DownloaderClientService {
  private readonly _client: Client

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this._client = new Client({
      endPoint: configService.get('s3client.endPoint'),
      port: configService.get('s3client.port'),
      useSSL: configService.get('s3client.useSSL'),
      accessKey: configService.get('s3client.accessKey'),
      secretKey: configService.get('s3client.secretKey')
    })
  }

  public get(): Client {
    return this._client
  }
}
