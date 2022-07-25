import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { OrderDto, UpdateDataDto } from './order.dto';
import { OrderInterface } from './order.interface';
import { PAYMENT_METHOD, PAYMENT_STATUS } from './order.const';

@Injectable()
export class OrderService {

    constructor(
        @Inject('API_SERVICE') private apiService: ClientProxy,
    ) {}

    async getOrder(data: OrderDto): Promise<OrderInterface> {
        const order = await lastValueFrom(this.apiService.send({cmd: 'get-order'}, data)
            .pipe(
                map(response => {
                    return response
                }),
                catchError(error => {
                    console.log(error)
                    throw new Error('Order not found')
                })
            ));
        
        order['method'] = PAYMENT_METHOD[order.paymentType];
        order['enablePurchase'] = order.status === PAYMENT_STATUS.PENDING;
        
        return order;
    }

    async updateOrder(orderId: number, updateData: UpdateDataDto): Promise<void> {
        await lastValueFrom(this.apiService.send({cmd: 'get-order'}, { orderId, updateData })
            .pipe(
                map(response => {
                    return response
                }),
                catchError(error => {
                    console.log(error)
                    throw new Error('An error occurred while processing payment, Please try again later')
                })
            ));
        
    } 
}
