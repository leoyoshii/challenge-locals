import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocalController } from './local.controller'
import { Local } from './local.entity'
import { LocalService } from './local.service'

@Module({
  imports: [TypeOrmModule.forFeature([Local]), HttpModule],
  providers: [LocalService],
  controllers: [LocalController],
})
export class LocalModule {}
