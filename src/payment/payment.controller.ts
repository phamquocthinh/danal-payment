// import { Controller, Get, Post, Body, Param, Query, Render } from '@nestjs/common';

// @Controller()
// export class PaymentController {
//   constructor() {}

//   @Get()
//   @Render('index')
//   test() {
//     return { message: 'Hello world!' };
//   }

// }

import { Controller, Get, Post, Body, Param, Query, Render } from '@nestjs/common';
import { DanalCreditCardService } from './danal-credit-card/danal-credit-card.service';

@Controller('danal-credit-card')
export class PaymentController {
  constructor(
      private danalCreditCardService: DanalCreditCardService,
  ) {}

  @Get('order')
  @Render('danal-credit-card/order')
  order() {
    return { message: 'Hello world!' };
  }

  @Post('ready')
  async ready(@Body() body: any) {
    return await this.danalCreditCardService.ready()
  }

}
