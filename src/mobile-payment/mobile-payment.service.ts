import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as urlencode from 'urlencode';

import {
    callTeleditService,
    makeItemInfo,
    makeTeleditParams,
    parseTeleditResponse
} from 'src/common/common.utils';
import { DANAL_VALUES, DANAL_URLS, DOMAIN, MIN_ORDER_AMOUNT } from 'src/common/common.const';
import { PAYMENT_ERROR } from 'src/common/common.error';
import { PAYMENT_STATUS } from 'src/order/order.const';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class DanalMobilePaymentService {
    private CPID: string;
    private PWD: string;
    private TELEDIT_PATH: string;

    constructor(
        private orderService: OrderService,
        private configService: ConfigService,
    ) {
        this.CPID = this.configService.get<string>('DANAL_TELEDIT_CPID');
        this.PWD = this.configService.get<string>('DANAL_TELEDIT_PWD');
        this.TELEDIT_PATH = this.configService.get<string>('DANAL_TELEDIT_PATH');
    }

    private _updateOrder(orderId: number, status: string = PAYMENT_STATUS.PAYMENT_FAIL, data: string | Record<string, any>) {
        const paymentData = JSON.stringify(data)
        const updateData = {
            status,
            paymentData,
        }

        return this.orderService.updateOrder(orderId, updateData);
    }

    private _readyData(orderData: Record<string, any>): string {
        const orderId = orderData.id;
        const requestData = new Map();

        const amount = orderData.payPoint ? orderData.totalValue - orderData.payPoint : orderData.totalValue;

        if (amount < MIN_ORDER_AMOUNT) {
            throw new Error(PAYMENT_ERROR.INVALID_AMOUNT(MIN_ORDER_AMOUNT));
        }

        requestData.set("ID", this.CPID);
        requestData.set("PWD", this.PWD);

        const itemName = "Product";
        const itemInfo = makeItemInfo(amount, '1270000000', itemName);

        requestData.set("USERID", orderData.user.id);
        requestData.set("ItemCount", "1");
        requestData.set("ItemInfo", itemInfo);
        requestData.set("OrderID", orderId);
        requestData.set("IsPreOtbill", "N");
        requestData.set("IsSubscript", "N");

        requestData.set("SERVICE", "TELEDIT");
        requestData.set("Command", "ITEMSEND2");
        requestData.set("OUTPUTOPTION", "DEFAULT");

        return makeTeleditParams(requestData);
    }

    private async _doReady(readyData: string) {
        const command = `${this.TELEDIT_PATH}/SClient "${readyData}"`;
        
        const resData = await callTeleditService(command);

        if (!resData) {
            throw new Error(PAYMENT_ERROR.REQUEST_PAYMENT);
        }

        const res = parseTeleditResponse(resData);

        console.log('READY_DATA', res);

        return res;
    }

    async ready(data) {
        const { orderId } = data;
        const orderData = await this.orderService.getOrder(data)

        if (!orderData || orderData.status !== PAYMENT_STATUS.PENDING) {
            throw new Error(PAYMENT_ERROR.ORDER_NOT_FOUND);
        }

        // await this.orderService.updateOrder(orderId, { status: PAYMENT_STATUS.PROCESSING });

        const readyData = this._readyData(orderData);
        const result = await this._doReady(readyData);

        if (result?.Result !== '0') {
            throw new Error(result?.ErrMsg);
        }

        const amount = orderData.payPoint ? orderData.totalValue - orderData.payPoint : orderData.totalValue;
        const returnUrl = `${DOMAIN}/mobile-payment/cpcgi`;
        const cancelUrl = `${DOMAIN}/mobile-payment/cancel?orderId=${orderId}`;

        const extraData = {
            'CPName': 'SmileMe',
            'ItemName': 'Product',
            'ItemAmt': amount,
            'TargetURL': returnUrl,
            'BackURL': cancelUrl,
            'IsPreOtbill': 'N',
            'IsSubscript': 'N',
            'IsCharSet': '',
            'Email': orderData.user.email || '',
            'ByPassValue': `orderId=${orderId}`,
        }

        return {
            ...result,
            ...extraData,
        };
    }

    async cpcgi(data: any) {
        console.log('POST CPCGI', data);
        const bypassValue = data['ByPassValue'];
        const orderId = bypassValue.spilt("=")[1];

        if (!orderId) {
            throw new Error(`Error while get bypassvalue from Teledit ${bypassValue}`);
        }

        const order = await this.orderService.getOrder({orderId})

        if (order?.status !== PAYMENT_STATUS.PENDING) {
            throw new Error(PAYMENT_ERROR.PAYMENT_ALREADY_PROCESSED);
        }

        const requestData = new Map();
        const amount = order.payPoint ? order.totalValue - order.payPoint : order.totalValue;


        requestData.set('ServerInfo', data['ServerInfo']);
        requestData.set('ConfirmOption', 1);
        requestData.set('AMOUNT', amount);
        requestData.set('CPID', this.CPID);
        requestData.set('Command', 'NCONFIRM');
        requestData.set('OUTPUTOPTION', 'DEFAULT');
        requestData.set('IFVERSION', 'V1.1.2');

        const command = `${this.TELEDIT_PATH}/SClient "${makeTeleditParams(requestData)}"`;
        const resData = await callTeleditService(command);

        if (!resData) {
            throw new Error(PAYMENT_ERROR.PROCESSING_PAYMENT);
        }
        
        const res = parseTeleditResponse(resData);

        if (res?.Result !== '0') {
            throw new Error(res?.ErrMsg);
        }

        

        console.log('BILL', res)

        const { RETURNCODE: returnCode, RETURNMSG: returnMessage } = res;

        if (returnCode !== DANAL_VALUES.SUCCESS_CODE) {
            await this._updateOrder(orderId, PAYMENT_STATUS.PAYMENT_FAIL, res);
            throw new Error(PAYMENT_ERROR.REQUEST_PAYMENT_WITH_CODE(returnCode, returnMessage));
        }

        return res;
    }

    async success(data: any) {
        console.log('POST SUCCESS', data)
        const { ORDERID: orderId } = data;

        await this._updateOrder(orderId, PAYMENT_STATUS.COMPLETED, data);

        return data;
    }

    async cancel(orderId: string) {
        console.log('GET CANCEL', orderId);
        await this._updateOrder(+orderId, PAYMENT_STATUS.CANCELLED, '');

        return;
    }
}


