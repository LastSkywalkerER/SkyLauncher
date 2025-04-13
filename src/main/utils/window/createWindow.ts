import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

import appIconFrescraft from '../../../../resources/FreshCraft/icon.png?asset'
import appIcon from '../../../../resources/SkyLauncher/icon.png?asset'

export const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,

    autoHideMenuBar: true,

    icon: import.meta.env['VITE_UI_TYPE'] === 'FreshCraft' ? appIconFrescraft : appIcon,
    title: import.meta.env['VITE_UI_TYPE'] || 'SkyLauncher',

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      // sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
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
  //
  // mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
  //   const { requestHeaders } = details
  //   UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*'])
  //   callback({ requestHeaders })
  // })
  //
  // mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   const { responseHeaders } = details
  //   UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*'])
  //   UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*'])
  //   callback({
  //     responseHeaders
  //   })
  // })

  return mainWindow
}
