import { Controller, Get, Post, Body, Param, Query, Render } from '@nestjs/common';
import { DanalBankTransferService } from './bank-transfer.service';
import { OrderDto } from 'src/order/order.dto';

@Controller('bank-transfer')
export class DanalBankTransferController {
  constructor(
      private danalBankTransferService: DanalBankTransferService,
  ) {}

  @Post('ready')
  @Render('danal-bank-transfer/ready')
  async ready(@Body() data: OrderDto) {
    return await this.danalBankTransferService.ready(data);
  }

  @Post('cpcgi')
  @Render('danal-bank-transfer/cpcgi')
  async cpcgi(@Body() data: any) {
    return await this.danalBankTransferService.cpcgi(data);
  }

  @Get('cancel')
  @Render('danal-bank-transfer/cancel')
  async cancel(@Param('orderId') orderId: string) {
    return await this.danalBankTransferService.cancel(orderId);
  }

  @Post('success')
  @Render('danal-bank-transfer/success')
  async success(@Body() data: any) {
    return await this.danalBankTransferService.success(data);
  }
}
