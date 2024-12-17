export interface DownloadRequest {
  fileUrl?: string
  fileName: string
  outputDirectory: string
  additionalUrls?: string[]
}

export interface DownloadResponse {
  filePath
}

export interface IDownloaderService {
  download(data: DownloadRequest): Promise<DownloadResponse>
}

export const IDownloaderServiceToken = Symbol('IDownloaderService')
