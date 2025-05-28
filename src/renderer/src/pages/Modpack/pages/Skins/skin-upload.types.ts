export interface SkinUploadFormData {
  variant: 'classic' | 'slim'
  filePath: string
  url: string
}

export interface SkinUploadFormProps {
  onSubmit: (data: SkinUploadFormData) => void
  uploading?: boolean
}
