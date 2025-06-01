import { ILauncherInfo } from '@renderer/entities/LauncherInfo'
import { ISettings, LauncherSettings } from '@renderer/entities/Settings/interfaces'
import { inject, injectable } from 'inversify'
import { Observable } from 'rxjs'
import { LauncherInfo } from 'src/shared/dtos/launcher.dto'

import { ILauncherSettingsService } from './interfaces'

@injectable()
export class LauncherSettingsService implements ILauncherSettingsService {
  public static readonly $ = ILauncherSettingsService.$
  public readonly $ = LauncherSettingsService.$

  constructor(
    @inject(ILauncherInfo.$) private readonly launcherInfo: ILauncherInfo,
    @inject(ISettings.$) private readonly settings: ISettings
  ) {
    this.getSettings = this.getSettings.bind(this)
    this.setSettings = this.setSettings.bind(this)
  }

  public get getLauncherInfo$(): Observable<LauncherInfo> {
    return this.launcherInfo.refreshLauncherInfo()
  }

  public getSettings(): Observable<LauncherSettings | null> {
    return this.settings.getSettings()
  }

  public setSettings(settings: Partial<LauncherSettings>): Observable<void> {
    return this.settings.setSettings(settings as LauncherSettings)
  }
}
