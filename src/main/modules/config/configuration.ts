import { config } from 'dotenv'
import { arch, platform } from '../../constants'

config()

export default () => ({
  hardware: {
    platform: platform,
    architecture: arch
  },
  s3client: {
    endPoint: process.env.MAIN_VITE_MINIO_ENDPOINT || import.meta.env.MAIN_VITE_MINIO_ENDPOINT,
    port: Number(process.env.MAIN_VITE_MINIO_PORT || import.meta.env.MAIN_VITE_MINIO_PORT),
    useSSL:
      (process.env.MAIN_VITE_MINIO_USESSL || import.meta.env.MAIN_VITE_MINIO_USESSL) === 'true',
    accessKey: process.env.MAIN_VITE_MINIO_ACCESSKEY || import.meta.env.MAIN_VITE_MINIO_ACCESSKEY,
    secretKey: process.env.MAIN_VITE_MINIO_SECRETKEY || import.meta.env.MAIN_VITE_MINIO_SECRETKEY
  }
})
