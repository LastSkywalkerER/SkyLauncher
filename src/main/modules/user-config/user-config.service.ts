import { Injectable } from '@nestjs/common'
import { defaults } from './user-config.schema'
import { ConfigKeys } from './user-config.types'
import Store from 'electron-store'

@Injectable()
export class UserConfigService {
  private _store = new Store({ defaults })

  public set(key: ConfigKeys, value: unknown) {
    this._store.set(key, value)
  }

  public get(key: ConfigKeys) {
    return this._store.get(key)
  }
}
