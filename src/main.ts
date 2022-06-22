import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { LocalModule } from './locals/local.module'

const port = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Country Challenge Swagger')
    .setDescription('Country Challenge API Description')
    .setVersion('1.0')
    .addTag('CountryChallenge')
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    include: [LocalModule],
  })

  SwaggerModule.setup('/docs', app, document, {
    customSiteTitle: 'Country Challenge Swagger',
  })

  await app.listen(port)

  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
