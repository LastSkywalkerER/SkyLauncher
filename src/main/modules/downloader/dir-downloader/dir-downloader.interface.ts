export interface DownloadFolderOptions {
  folderName: string
  destinationPath: string
  bucketName: string
  debug: (data: string) => void
}
