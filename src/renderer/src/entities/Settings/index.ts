import { injectable } from 'inversify'

import { CustomLauncherOptions, ISettings } from './interfaces'
import { environment } from '../../shared/config/environments'

const defauleSettings: CustomLauncherOptions = {
  name: 'Player',
  maxRam: '8192',
  minRam: '1024',
  port: environment.serverPort,
  ip: environment.serverIp
}

@injectable()
export class Settings implements ISettings {
  private _settings: CustomLauncherOptions

  constructor() {
    this._settings = defauleSettings

    this.getSettings = this.getSettings.bind(this)
    this.setSettings = this.setSettings.bind(this)
  }

  public getSettings(): CustomLauncherOptions {
    return this._settings
  }

  public setSettings(settings: CustomLauncherOptions): void {
    this._settings = settings
  }
}
