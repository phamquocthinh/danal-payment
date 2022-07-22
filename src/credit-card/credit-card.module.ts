import { Module } from '@nestjs/common';

import { OrderModule } from 'src/order/order.module';
import { DanalCreditCardController } from './credit-card.controller';
import { DanalCreditCardService } from './credit-card.service';

@Module({
    imports: [
        OrderModule,
    ],
    controllers: [
        DanalCreditCardController,
    ],
    providers: [DanalCreditCardService],
    exports: [DanalCreditCardService]
})
export class DanalCreditCardModule { }
