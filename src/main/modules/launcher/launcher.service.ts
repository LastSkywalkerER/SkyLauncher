import { Injectable } from '@nestjs/common'

@Injectable()
export class LauncherService {
  constructor() {
    console.log('LauncherService instantiated')
  }

  public async getOptions(): Promise<boolean> {
    return true
  }
}
