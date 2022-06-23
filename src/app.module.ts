import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import typeOrmConfig from 'db/database.config'
import { LocalModule } from './locals/local.module'

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), LocalModule],
})
export class AppModule {}
