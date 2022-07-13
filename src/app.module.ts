import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { PaymentController } from './payment/payment.controller';

import { DanalCreditCardModule } from './payment/danal-credit-card/danal-credit-card.module';

import { DanalCreditCardController } from './payment/danal-credit-card/danal-credit-card.controller';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'PAYMENT_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://localhost:5672'],
    //       queue: 'cats_queue',
    //       queueOptions: {
    //         durable: false
    //       },
    //     },
    //   },
    // ]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    DanalCreditCardModule
  ],
  controllers: [
    // PaymentController,
    DanalCreditCardController
  ],
  providers: [],
})
export class AppModule {}
