export interface Unzip {
  outputDirectory: string
  zipPath: string
}

export interface DownloadFromS3 {
  bucketName: string
  objectPath: string
  fileName: string
  outputDirectory: string
}

export interface DownloadFromUrl {
  fileUrl: string
  fileName: string
  outputDirectory: string
}
