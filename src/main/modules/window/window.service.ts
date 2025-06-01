import { Window } from '@doubleshot/nest-electron'
import { Injectable, Logger } from '@nestjs/common'
import { BrowserWindow } from 'electron'

@Injectable()
export class WindowService {
  private readonly logger = new Logger(WindowService.name)

  constructor(@Window() private readonly mainWindow: BrowserWindow) {}

  public minimizeWindow(): boolean {
    try {
      if (!this.mainWindow) {
        this.logger.warn('Main window not found for minimize operation')
        return false
      }

      if (this.mainWindow.isDestroyed()) {
        this.logger.warn('Cannot minimize destroyed window')
        return false
      }

      this.mainWindow.minimize()
      this.mainWindow.hide()
      this.logger.log('Window minimized successfully')
      return true
    } catch (error) {
      this.logger.error('Failed to minimize window', error)
      return false
    }
  }

  public restoreWindow(): boolean {
    try {
      if (!this.mainWindow) {
        this.logger.warn('Main window not found for restore operation')
        return false
      }

      if (this.mainWindow.isDestroyed()) {
        this.logger.warn('Cannot restore destroyed window')
        return false
      }

      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore()
        this.logger.log('Window restored successfully')
      } else {
        this.logger.log('Window is not minimized, bringing to front')
        this.mainWindow.show()
        this.mainWindow.focus()
      }

      return true
    } catch (error) {
      this.logger.error('Failed to restore window', error)
      return false
    }
  }
}
