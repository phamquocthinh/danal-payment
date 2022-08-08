import { Module } from '@nestjs/common';

import { OrderModule } from 'src/order/order.module';
import { DanalVirtualAccountController } from './virtual-account.controller';
import { DanalVirtualAccountService } from './virtual-account.service';

@Module({
    imports: [
        OrderModule,
    ],
    controllers: [
        DanalVirtualAccountController,
    ],
    providers: [DanalVirtualAccountService],
    exports: [DanalVirtualAccountService]
})
export class DanalVirtualAccountModule { }
