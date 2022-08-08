import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrderModule } from './order/order.module';
import { DanalCreditCardModule } from './credit-card/credit-card.module';
import { DanalBankTransferModule } from './bank-transfer/bank-transfer.module';
import { DanalVirtualAccountModule } from './virtual-account/virtual-account.module';
import { DanalMobilePaymentModule } from './mobile-payment/mobile-payment.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    OrderModule,
    DanalCreditCardModule,
    DanalBankTransferModule,
    DanalVirtualAccountModule,
    DanalMobilePaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
