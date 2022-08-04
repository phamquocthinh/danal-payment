import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/payment/',
  });
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, 'views/partials'));
  
  app.enableCors();
  app.setGlobalPrefix('payment');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.listen(port)
}
bootstrap();
