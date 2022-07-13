import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  app.enableCors();
  app.setGlobalPrefix('payment');

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [configService.get('RABBIT_HOST')],
  //     queue: configService.get('RABBIT_PAYMENT_QUEUE'),
  //     noAck: false,
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });

  await Promise.all([
    // app.startAllMicroservices(),
    app.listen(port)
  ]);
}
bootstrap();
