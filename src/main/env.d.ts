/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_MINIO_endPoint: string
  readonly MAIN_VITE_MINIO_port: string
  readonly MAIN_VITE_MINIO_useSSL: string
  readonly MAIN_VITE_MINIO_accessKey: string
  readonly MAIN_VITE_MINIO_secretKey: string
  readonly MAIN_VITE_CURSEFORGE_APIKEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
