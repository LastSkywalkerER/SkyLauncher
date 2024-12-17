export interface UnzipRequest {
  inputPath: string
  outputPath: string
}

export interface UnzipResponse {
  filePath: string
}

export interface IUnzipService {
  execute(data: UnzipRequest): Promise<UnzipResponse>
}
