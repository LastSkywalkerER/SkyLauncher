export interface DownloadAndUnzipOptions {
  zipPath: string
  destinationPath: string
  bucketName: string
  version: string
  debug: (data: string) => void
}
