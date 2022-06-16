import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './main/factories/app.module'

const port = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Country Challenge Example')
    .setDescription('Country Challenge API Description')
    .setVersion('1.0')
    .addTag('CountryChallenge')
    .build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('challenge', app, document)

  await app.listen(port)
}

bootstrap()
