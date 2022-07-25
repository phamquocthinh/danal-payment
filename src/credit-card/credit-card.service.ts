import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as urlencode from 'urlencode';
import * as fetch from 'node-fetch';

import {
    str2data,
    data2string,
    encrypt,
    decrypt
} from 'src/common/common.utils';
import { DANAL_VALUES, DANAL_URLS } from 'src/common/common.const';
import { PAYMENT_STATUS } from 'src/order/order.const';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class DanalCreditCardService {
    private CPID: string;
    private CRYPTOKEY: Buffer;
    private IVKEY: Buffer;

    constructor(
        private orderService: OrderService,
        private configService: ConfigService,
    ) {
        this.CPID = this.configService.get<string>('DANAL_CPID');
        this.CRYPTOKEY = Buffer.from(this.configService.get<string>('DANAL_CRYPTOKEY'), 'hex');
        this.IVKEY = Buffer.from(this.configService.get<string>('DANAL_IVKEY'), 'hex');
    }

    private _handleError(orderId: number, error: string | Record<string, any>) {
        const errorMessage = JSON.stringify(error)
        const updateData = {
            status: PAYMENT_STATUS.PAYMENT_FAIL,
            paymentData: errorMessage,
        }

        return this.orderService.updateOrder(orderId, updateData);
    }

    private _readyData(orderData: Record<string, any>): string {
        const RETURNURL = 'https://phpstack-805617-2760205.cloudwaysapps.com/CPCGI.php';
        const CANCELURL = 'https://phpstack-805617-2760205.cloudwaysapps.com/Cancel.php';

        const requestData = new Map();

        requestData.set('SUBCPID', '');
        requestData.set('AMOUNT', orderData.totalValue);
        requestData.set('CURRENCY', DANAL_VALUES.CURRENCY.WON);
        requestData.set('ITEMNAME', DANAL_VALUES.ITEMNAME);
        requestData.set('USERAGENT', DANAL_VALUES.USERAGENT.MOBILE);
        requestData.set('ORDERID', orderData.id);
        requestData.set('USERNAME', orderData.user.nickname);
        requestData.set('USERID', orderData.user.id);
        requestData.set('USEREMAIL', orderData.user.email);
        requestData.set('CANCELURL', CANCELURL);
        requestData.set('RETURNURL', RETURNURL);
        requestData.set('TXTYPE', DANAL_VALUES.TXTYPE);
        requestData.set('SERVICETYPE', DANAL_VALUES.SERVICETYPE.CREDIT_CARD);
        requestData.set('ISNOTI', DANAL_VALUES.ISNOTI);
        requestData.set('BYPASSVALUE', '');

        const cpdata = data2string(requestData);
        const cipherText = urlencode.encode(encrypt(cpdata, this.CRYPTOKEY, this.IVKEY));

        return cipherText;
    }

    private async _doReady(readyData: string) {
        const url = `${DANAL_URLS.CREDIT_CARD}?CPID=${this.CPID}&DATA=${readyData}`;
        const resData = await (await fetch(url, {
            method: 'POST'
        })).text();

        const decodeCipherText = urlencode.decode(resData, 'EUC-KR');
        const dataValue = decodeCipherText.split('=');
        const decryptedData = decrypt(dataValue[1], this.CRYPTOKEY, this.IVKEY);
        const res = str2data(decryptedData);

        console.log(res)

        return res;
    }

    async ready(data) {
        const { orderId } = data;
        const orderData = await this.orderService.getOrder(data)

        if (!orderData || orderData.status !== PAYMENT_STATUS.PENDING) {
            throw new Error(`Order not found`);
        }

        console.log(data)
        console.log(typeof data.orderId)
        await this.orderService.updateOrder(orderId, { status: PAYMENT_STATUS.PROCESSING });
        console.log('zzzz')

        const readyData = this._readyData(orderData);
        const result = await this._doReady(readyData);

        return result;
    }

    async cpcgi(returnParams: string) {
        const paramsString: string = decrypt(returnParams, this.CRYPTOKEY, this.IVKEY);
        const params = str2data(paramsString);

        const { RETURNCODE: code, ORDERID: orderId } = params;

        if (code !== DANAL_VALUES.SUCCESS_CODE) {
            return this._handleError(orderId, params)
        }
    }
}


