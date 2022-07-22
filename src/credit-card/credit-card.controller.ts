import { Controller, Get, Post, Body, Param, Query, Render } from '@nestjs/common';
import { DanalCreditCardService } from './credit-card.service';
import { OrderDto } from './credit-card.dto';

@Controller('credit-card')
export class DanalCreditCardController {
  constructor(
      private danalCreditCardService: DanalCreditCardService,
  ) {}

  @Post('ready')
  @Render('danal-credit-card/ready')
  async ready(@Body() data: OrderDto) {
    return await this.danalCreditCardService.ready(data)
  }

  @Post('cpcgi')
  async cpcgi(@Body() body: any) {
    console.log(body)
  }

}
