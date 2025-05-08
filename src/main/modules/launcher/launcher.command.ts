import { ChildProcess } from 'node:child_process'

import { Command } from '@nestjs/cqrs'
import { MCUser } from '@shared/dtos/launcher.dto'

import { MCGameVersion } from '../../../shared/entities/mc-game-version/mc-game-version.entity'

export class LaunchCommandBase extends Command<ChildProcess> {
  constructor(
    public readonly target: MCGameVersion,
    public readonly user: MCUser
  ) {
    super()
  }
}
