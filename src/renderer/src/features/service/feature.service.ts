import { inject, injectable } from 'inversify'
import { from, Observable, tap } from 'rxjs'

import { RendererApi } from '../../../../shared/api/types'
import { FolderPathDto } from '../../../../shared/dtos/filesystem.dto'
import { Versions } from '../../entities/Versions/index'
import { IVersions } from '../../entities/Versions/interfaces'
import { NodeApi } from '../../shared/api/NodeApi/index'
import { INodeApi } from '../../shared/api/NodeApi/interfaces'
import { IFeatureService } from './interfaces'

@injectable()
export class FeatureService implements IFeatureService {
  private _nodeApi: RendererApi
  private _versionsService: Versions

  constructor(
    @inject(INodeApi.$) nodeApi: NodeApi,
    @inject(IVersions.$) versionsService: Versions
  ) {
    this._nodeApi = nodeApi.getMainProcessApi()
    this._versionsService = versionsService

    this.openFolder = this.openFolder.bind(this)
    this.removeFolder = this.removeFolder.bind(this)
  }

  public openFolder({ path }: FolderPathDto): Observable<string> {
    return from(
      this._nodeApi.openFolder({
        path
      })
    )
  }

  public removeFolder({ path }: FolderPathDto): Observable<void> {
    return from(
      this._nodeApi.removeFolder({
        path
      })
    ).pipe(tap(() => this._versionsService.checkLocalMCVersions()))
  }
}
