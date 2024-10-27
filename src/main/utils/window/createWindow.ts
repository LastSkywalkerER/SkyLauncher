import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

// import iconLinux from '../../../../resources/icon.png?asset'
// import iconWin from '../../../../resources/icon.ico?asset'
// import iconMac from '../../../../resources/icon.icns?asset'

export const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true,
    // ...(process.platform === 'linux'
    //   ? { icon: iconLinux }
    //   : process.platform === 'win32'
    //     ? { icon: iconWin }
    //     : { icon: iconMac }),
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

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
