import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import TypeOrmConfig from 'db/database.config'
import { LocalModule } from './locals/local.module'

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), LocalModule],
})
export class AppModule {}
