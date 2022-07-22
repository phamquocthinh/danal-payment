import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { OrderDto } from './order.dto';
import { OrderInterface } from './order.interface';
import { PAYMENT_METHOD } from './order.const';

@Injectable()
export class OrderService {

    constructor(
        @Inject('API_SERVICE') private apiService: ClientProxy,
    ) {}

    async getOrder(data: OrderDto): Promise<OrderInterface> {
        const { data: order } = await lastValueFrom(this.apiService.send({cmd: 'get-order'}, data)
            .pipe(
                map(response => {
                    return response
                }),
                catchError(error => {
                    console.log(error)
                    throw new Error(error)
                })
            ));
        
        order['method'] = PAYMENT_METHOD[order.paymentType];
        
        return order;
    }
}
