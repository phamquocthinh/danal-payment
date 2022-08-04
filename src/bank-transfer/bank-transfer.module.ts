import { Module } from '@nestjs/common';

import { OrderModule } from 'src/order/order.module';
import { DanalBankTransferController } from './bank-transfer.controller';
import { DanalBankTransferService } from './bank-transfer.service';

@Module({
    imports: [
        OrderModule,
    ],
    controllers: [
        DanalBankTransferController,
    ],
    providers: [DanalBankTransferService],
    exports: [DanalBankTransferService]
})
export class DanalBankTransferModule { }
