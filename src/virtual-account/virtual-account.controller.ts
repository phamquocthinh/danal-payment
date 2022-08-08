import { Controller, Get, Post, Body, Param, Query, Render } from '@nestjs/common';
import { DanalVirtualAccountService } from './virtual-account.service';
import { OrderDto } from 'src/order/order.dto';

@Controller('virtual-account')
export class DanalVirtualAccountController {
  constructor(
      private danalVirtualAccountService: DanalVirtualAccountService,
  ) {}

  @Post('ready')
  @Render('danal-virtual-account/ready')
  async ready(@Body() data: OrderDto) {
    return await this.danalVirtualAccountService.ready(data);
  }

  @Post('cpcgi')
  @Render('danal-virtual-account/cpcgi')
  async cpcgi(@Body() data: any) {
    return await this.danalVirtualAccountService.cpcgi(data);
  }

  @Get('cancel')
  @Render('danal-virtual-account/cancel')
  async cancel(@Query('orderId') orderId: string) {
    return await this.danalVirtualAccountService.cancel(orderId);
  }

  @Post('success')
  @Render('danal-virtual-account/success')
  async success(@Body() data: any) {
    return await this.danalVirtualAccountService.success(data);
  }
}
