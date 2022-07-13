import { Module } from '@nestjs/common';
import { DanalCreditCardController } from './danal-credit-card.controller';
import { DanalCreditCardService } from './danal-credit-card.service';

@Module({
    imports: [],
    controllers: [
        DanalCreditCardController,
    ],
    providers: [DanalCreditCardService],
    exports: [DanalCreditCardService]
})
export class DanalCreditCardModule { }
