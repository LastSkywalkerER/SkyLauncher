import { config } from 'dotenv'

config()

export default () => ({
  s3client: {
    endPoint: process.env.MAIN_VITE_MINIO_endPoint || import.meta.env.MAIN_VITE_MINIO_endPoint,
    port: Number(process.env.MAIN_VITE_MINIO_port || import.meta.env.MAIN_VITE_MINIO_port),
    useSSL:
      (process.env.MAIN_VITE_MINIO_useSSL || import.meta.env.MAIN_VITE_MINIO_useSSL) === 'true',
    accessKey: process.env.MAIN_VITE_MINIO_accessKey || import.meta.env.MAIN_VITE_MINIO_accessKey,
    secretKey: process.env.MAIN_VITE_MINIO_secretKey || import.meta.env.MAIN_VITE_MINIO_secretKey
  }
})
