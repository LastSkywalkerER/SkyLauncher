import { Injectable } from '@nestjs/common'
import { deepMerge } from '@main/utils/deepMerge'
import { defaults } from '../../../default.config'

import { ConfigKeys, UserConfigData, ValueOfPath } from '../../../dtos/config.dto'

import Store from 'electron-store'

@Injectable()
export class UserConfigService {
  private _store = new Store({ defaults })

  public set(value: UserConfigData): void {
    this._store.set(deepMerge(defaults, value))
  }

  public get<T extends ConfigKeys>(key: T): ValueOfPath<UserConfigData, T> {
    return this._store.get(key)
  }
}
