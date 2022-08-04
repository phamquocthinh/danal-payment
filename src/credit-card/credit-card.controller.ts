import { Controller, Get, Post, Body, Param, Query, Render } from '@nestjs/common';
import { DanalCreditCardService } from './credit-card.service';
import { OrderDto } from 'src/order/order.dto';

@Controller('credit-card')
export class DanalCreditCardController {
  constructor(
      private danalCreditCardService: DanalCreditCardService,
  ) {}

  @Post('ready')
  @Render('danal-credit-card/ready')
  async ready(@Body() data: OrderDto) {
    return await this.danalCreditCardService.ready(data);
  }

  @Post('cpcgi')
  @Render('danal-credit-card/cpcgi')
  async cpcgi(@Body() data: any) {
    return await this.danalCreditCardService.cpcgi(data);
  }

  @Get('cancel')
  @Render('danal-credit-card/cancel')
  async cancel(@Param('orderId') orderId: string) {
    return await this.danalCreditCardService.cancel(orderId);
  }

  @Post('success')
  @Render('danal-credit-card/success')
  async success(@Body() data: any) {
    return await this.danalCreditCardService.success(data);
  }
}
