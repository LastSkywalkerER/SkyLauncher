import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration], // Загрузка конфигурации из файла configuration.ts
      isGlobal: true // Делаем модуль глобальным, чтобы он был доступен в любом модуле
    })
  ]
})
export class AppConfigModule {}
