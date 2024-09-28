import { Client } from 'minio'
import config from '../config'

console.log(config)

export const minioClient = new Client({
  endPoint: config.endPoint,
  port: config.port,
  useSSL: config.useSSL,
  accessKey: config.accessKey,
  secretKey: config.secretKey
})
