import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';

import { OrderDto, UpdateDataDto } from './order.dto';
import { OrderInterface } from './order.interface';
import { PAYMENT_METHOD, PAYMENT_STATUS } from './order.const';

@Injectable()
export class OrderService {

    constructor(
        @Inject('API_SERVICE') private apiService: ClientProxy,
    ) {}

    async getOrder(data: OrderDto): Promise<OrderInterface> {
        const order = await lastValueFrom(this.apiService.send({cmd: 'getOrder'}, { orderId: data.orderId }));
        
        order['method'] = PAYMENT_METHOD[order.paymentType];
        order['enablePurchase'] = order.status === PAYMENT_STATUS.PENDING && order['method'];
        
        return order;
    }

    async updateOrder(orderId: number, updateData: UpdateDataDto): Promise<void> {
        return await lastValueFrom(this.apiService.send({cmd: 'updateOrder'}, { orderId, updateData }))
    } 
}
