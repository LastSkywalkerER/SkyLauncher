import { arch, platform } from '../../../shared/constants'

const defaultConfig = {
  hardware: {
    platform: platform,
    architecture: arch
  },
  s3client: {
    endPoint: import.meta.env.MAIN_VITE_MINIO_ENDPOINT,
    port: Number(import.meta.env.MAIN_VITE_MINIO_PORT),
    useSSL: import.meta.env.MAIN_VITE_MINIO_USESSL === 'true',
    accessKey: import.meta.env.MAIN_VITE_MINIO_ACCESSKEY,
    secretKey: import.meta.env.MAIN_VITE_MINIO_SECRETKEY
  },
  curseForgeApiKey: import.meta.env.MAIN_VITE_CURSEFORGE_APIKEY,
  javaBaseUrl: import.meta.env.MAIN_VITE_JAVA_BASE_URL
}

export default (): typeof defaultConfig => defaultConfig
