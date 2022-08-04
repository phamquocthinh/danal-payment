import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrderModule } from './order/order.module';
import { DanalCreditCardModule } from './credit-card/credit-card.module';
import { DanalBankTransferModule } from './bank-transfer/bank-transfer.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    OrderModule,
    DanalCreditCardModule,
    DanalBankTransferModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
