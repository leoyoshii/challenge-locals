import { TypeOrmModuleOptions } from '@nestjs/typeorm'

const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'challenge',
  synchronize: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
}

export default TypeOrmConfig
