import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

import appIconFrescraft from '../../../../resources/FreshCraft/icon.png?asset'
import appIcon from '../../../../resources/SkyLauncher/icon.png?asset'

export const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 720,
    minHeight: 480,
    width: 1280,
    height: 720,
    show: false,

    autoHideMenuBar: true,

    icon: import.meta.env['VITE_UI_TYPE'] === 'FreshCraft' ? appIconFrescraft : appIcon,
    title: import.meta.env['VITE_UI_TYPE'] || 'SkyLauncher',

    webPreferences: {
      webviewTag: true,
      preload: join(__dirname, '../preload/index.js'),
      // sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: !is.dev // Отключаем webSecurity только в dev режиме для CORS
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  is.dev &&
    mainWindow.webContents.openDevTools({
      mode: 'detach',
      activate: true,
      title: 'DevTools'
    })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // Только в dev режиме добавляем CORS заголовки для внешних API
  if (is.dev) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      const { responseHeaders } = details
      if (details.url.includes('api.minecraftservices.com') && responseHeaders) {
        responseHeaders['Access-Control-Allow-Origin'] = ['*']
        responseHeaders['Access-Control-Allow-Headers'] = ['*']
        responseHeaders['Access-Control-Allow-Methods'] = ['*']
      }
      callback({
        responseHeaders
      })
    })
  }

  return mainWindow
}
