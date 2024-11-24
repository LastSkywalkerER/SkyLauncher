import { Injectable } from '@nestjs/common'
import Store from 'electron-store'

import { defaults } from '../../../shared/default.config'
import { ConfigKeys, UserConfigData } from '../../../shared/dtos/config.dto'

@Injectable()
export class UserConfigService {
  private _store = new Store({ defaults })

  public set(value: UserConfigData): void {
    this._store.set(value)
  }

  public get<T extends ConfigKeys>(key: T): Required<UserConfigData>[T] {
    return this._store.get(key, defaults[key] as Required<UserConfigData>[T])
  }
}
