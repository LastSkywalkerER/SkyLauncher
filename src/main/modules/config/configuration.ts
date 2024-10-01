import { config } from 'dotenv'

config()

export default () => ({
  s3client: {
    endPoint: process.env.MAIN_MINIO_endPoint!,
    port: Number(process.env.MAIN_MINIO_port!),
    useSSL: !!process.env.MAIN_MINIO_useSSL!,
    accessKey: process.env.MAIN_MINIO_accessKey!,
    secretKey: process.env.MAIN_MINIO_secretKey!
  }
})
