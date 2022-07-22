import { Controller, Get, Query, Render } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(
      private orderService: OrderService
  ) {}

  @Get('')
  @Render('order')
  async order(@Query() data: OrderDto) {
    return await this.orderService.getOrder(data);
  }
}
