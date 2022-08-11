import { Controller, Get, Post, Body, Param, Query, Render } from '@nestjs/common';
import { DanalMobilePaymentService } from './mobile-payment.service';
import { OrderDto } from 'src/order/order.dto';

@Controller('mobile-payment')
export class DanalMobilePaymentController {
  constructor(
      private danalMobilePaymentService: DanalMobilePaymentService,
  ) {}

  @Post('ready')
  @Render('danal-mobile-payment/ready')
  async ready(@Body() data: OrderDto) {
    return await this.danalMobilePaymentService.ready(data);
  }

  @Post('cpcgi')
  @Render('danal-mobile-payment/cpcgi')
  async cpcgi(@Body() data: any) {
    return await this.danalMobilePaymentService.cpcgi(data);
  }

  @Get('cancel')
  @Render('danal-mobile-payment/cancel')
  async cancel(@Query('orderId') orderId: string) {
    return await this.danalMobilePaymentService.cancel(orderId);
  }

  @Post('cancel')
  @Render('danal-mobile-payment/cancel')
  async cancelPost(@Query('orderId') orderId: string) {
    return await this.danalMobilePaymentService.cancel(orderId);
  }

  @Post('success')
  @Render('danal-mobile-payment/success')
  async success(@Body() data: any) {
    return await this.danalMobilePaymentService.success(data);
  }
}
