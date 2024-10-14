import { Injectable } from '@nestjs/common'
import { merge } from 'ts-deepmerge'
import { defaults } from '../../../default.config'

import { ConfigKeys, UserConfigData } from '../../../dtos/config.dto'

import Store from 'electron-store'

@Injectable()
export class UserConfigService {
  private _store = new Store({ defaults })

  public set(value: UserConfigData): void {
    this._store.set(merge(defaults, value))
  }

  public get<T extends ConfigKeys>(key: T): Required<UserConfigData>[T] {
    return this._store.get(key, defaults[key] as Required<UserConfigData>[T])
  }
}
