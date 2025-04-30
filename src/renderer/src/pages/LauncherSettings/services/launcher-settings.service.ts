import { INodeApi } from '@renderer/shared/api/NodeApi/interfaces'
import { inject, injectable } from 'inversify'
import { from, Observable } from 'rxjs'
import { LauncherInfo } from 'src/shared/dtos/launcher.dto'

import { ILauncherSettingsService } from './interfaces'

@injectable()
export class LauncherSettingsService implements ILauncherSettingsService {
  public static readonly $ = ILauncherSettingsService.$
  public readonly $ = LauncherSettingsService.$

  constructor(@inject(INodeApi.$) private readonly nodeApi: INodeApi) {}

  public get getLauncherInfo$(): Observable<LauncherInfo> {
    return from(this.nodeApi.getMainProcessApi().getLauncherInfo())
  }
}
