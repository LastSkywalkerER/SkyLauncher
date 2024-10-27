import { ElectronAPI } from '@electron-toolkit/preload'

import { RendererApi } from '../api/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: RendererApi
  }
}
