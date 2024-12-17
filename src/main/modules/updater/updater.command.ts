import { Command } from '@nestjs/cqrs'

import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'

export class UpdateCommandBase extends Command<MCGameVersion> {
  constructor(public readonly target: MCGameVersion) {
    super()
  }
}
