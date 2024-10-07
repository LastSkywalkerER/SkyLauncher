/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_MINIO_ENDPOINT: string
  readonly MAIN_VITE_MINIO_PORT: string
  readonly MAIN_VITE_MINIO_USESSL: string
  readonly MAIN_VITE_MINIO_ACCESSKEY: string
  readonly MAIN_VITE_MINIO_SECRETKEY: string
  readonly MAIN_VITE_CURSEFORGE_APIKEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
