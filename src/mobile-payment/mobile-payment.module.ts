import { Module } from '@nestjs/common';

import { OrderModule } from 'src/order/order.module';
import { DanalMobilePaymentController } from './mobile-payment.controller';
import { DanalMobilePaymentService } from './mobile-payment.service';

@Module({
    imports: [
        OrderModule,
    ],
    controllers: [
        DanalMobilePaymentController,
    ],
    providers: [DanalMobilePaymentService],
    exports: [DanalMobilePaymentService]
})
export class DanalMobilePaymentModule { }
