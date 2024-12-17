import { config } from 'dotenv'

import { arch, platform } from '../../../shared/constants'

config()

const defaultConfig = {
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
  },
  curseForgeApiKey:
    process.env.MAIN_VITE_CURSEFORGE_APIKEY || import.meta.env.MAIN_VITE_CURSEFORGE_APIKEY,
  javaBaseUrl: process.env.MAIN_VITE_JAVA_BASE_URL || import.meta.env.MAIN_VITE_JAVA_BASE_URL
}

export default (): typeof defaultConfig => defaultConfig
