import { ILauncherInfo } from '@renderer/entities/LauncherInfo'
import { inject, injectable } from 'inversify'
import { Observable } from 'rxjs'
import { LauncherInfo } from 'src/shared/dtos/launcher.dto'

import { ILauncherSettingsService } from './interfaces'

@injectable()
export class LauncherSettingsService implements ILauncherSettingsService {
  public static readonly $ = ILauncherSettingsService.$
  public readonly $ = LauncherSettingsService.$

  constructor(@inject(ILauncherInfo.$) private readonly launcherInfo: ILauncherInfo) {}

  public get getLauncherInfo$(): Observable<LauncherInfo> {
    return this.launcherInfo.refreshLauncherInfo()
  }
}
