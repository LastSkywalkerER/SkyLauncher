import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import { app, systemPreferences } from 'electron'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { ElectronIpcTransport } from '@doubleshot/nest-electron'
import { AppModule } from './app.module'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { ValidationPipe } from '@nestjs/common'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit(): Promise<void> {
  const isDev = !app.isPackaged

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  if (isDev) {
    if (process.platform === 'win32') {
      process.on('message', (data) => {
        if (data === 'graceful-exit') app.quit()
      })
    } else {
      process.on('SIGTERM', () => {
        app.quit()
      })
    }
  }

  await app.whenReady()
}

async function bootstrap(): Promise<void> {
  try {
    await electronAppInit()

    systemPreferences.askForMediaAccess('microphone')

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    const nestApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      strategy: new ElectronIpcTransport('IpcTransport')
    })
    nestApp.useGlobalPipes(new ValidationPipe())

    await nestApp.listen()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    app.quit()
  }
}

bootstrap()
