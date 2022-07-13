import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

// import { PaymentController } from './payment.controller';
import { DanalCreditCardModule } from './danal-credit-card/danal-credit-card.module';

import { DanalCreditCardController } from './danal-credit-card/danal-credit-card.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
        {
          name: 'PAYMENT_SERVICE',
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              queue: configService.get<string>('RMQ_PAYMENT_QUEUE'),
              urls: [configService.get<string>('RMQ_URL')],
              queueOptions: { durable: false },
            },
          }),
          inject: [ConfigService],
        },
    ]),
    DanalCreditCardModule,
  ],
  controllers: [
    DanalCreditCardController,
  ],
  providers: [],
})
export class AppModule {}
