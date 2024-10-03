import { contextBridge, IpcRenderer, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { CreateLauncher, Version } from './interfaces'

// Custom APIs for renderer
const api = {
  getMinceraftVersions: (): Promise<Record<string, Version>> =>
    ipcRenderer.invoke('getMinceraftVersions'),
  launchMinecraft: (data: CreateLauncher): Promise<void> =>
    ipcRenderer.invoke('launchMinecraft', data),
  setLogger: (logTracer: (data: string) => void): IpcRenderer =>
    ipcRenderer.on('debug', (_, message: string) => logTracer(message))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
