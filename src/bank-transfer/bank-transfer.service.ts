import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as urlencode from 'urlencode';

import {
    str2data,
    data2string,
    encrypt,
    decrypt,
    callDanalService,
} from 'src/common/common.utils';
import { DANAL_VALUES, DANAL_URLS, DOMAIN, MIN_ORDER_AMOUNT } from 'src/common/common.const';
import { PAYMENT_ERROR } from 'src/common/common.error';
import { PAYMENT_STATUS } from 'src/order/order.const';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class DanalBankTransferService {
    private CPID: string;
    private CRYPTOKEY: Buffer;
    private IVKEY: Buffer;

    constructor(
        private orderService: OrderService,
        private configService: ConfigService,
    ) {
        this.CPID = this.configService.get<string>('DANAL_BANK_CPID');
        this.CRYPTOKEY = Buffer.from(this.configService.get<string>('DANAL_BANK_CRYPTOKEY'), 'hex');
        this.IVKEY = Buffer.from(this.configService.get<string>('DANAL_BANK_IVKEY'), 'hex');
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
        const returnUrl = `${DOMAIN}/bank-transfer/cpcgi`;
        const cancelUrl = `${DOMAIN}/bank-transfer/cancel?orderId=${orderData.id}`;

        const requestData = new Map();

        const amount = orderData.payPoint ? orderData.totalValue - orderData.payPoint : orderData.totalValue;

        if (amount < MIN_ORDER_AMOUNT) {
            throw new Error(PAYMENT_ERROR.INVALID_AMOUNT(MIN_ORDER_AMOUNT));
        }

        requestData.set('AMOUNT', amount);
        requestData.set('ITEMNAME', DANAL_VALUES.ITEMNAME);
        requestData.set('USERAGENT', DANAL_VALUES.USERAGENT.BANK_TRANSFER.MOBILE);
        requestData.set('ORDERID', orderData.id);
        requestData.set('USERNAME', orderData.user.nickname);
        requestData.set('USERID', orderData.user.id);
        requestData.set('USEREMAIL', orderData.user.email);
        requestData.set('CANCELURL', cancelUrl);
        requestData.set('RETURNURL', returnUrl);
        requestData.set('TXTYPE', DANAL_VALUES.TXTYPE.BANK_TRANSFER.READY);
        requestData.set('SERVICETYPE', DANAL_VALUES.SERVICETYPE.BANK_TRANSFER);
        requestData.set('ISNOTI', DANAL_VALUES.ISNOTI);
        requestData.set('BYPASSVALUE', `userId=${orderData.user.id}`);

        const cpdata = data2string(requestData);
        const cipherText = urlencode.encode(encrypt(cpdata, this.CRYPTOKEY, this.IVKEY));

        return cipherText;
    }

    private async _doReady(readyData: string) {
        const url = `${DANAL_URLS.BANK_TRANSFER}?CPID=${this.CPID}&DATA=${readyData}`;
        const resData = await callDanalService(url);

        if (!resData) {
            throw new Error(PAYMENT_ERROR.REQUEST_PAYMENT);
        }

        const decodeCipherText = urlencode.decode(resData, 'EUC-KR');
        const dataValue = decodeCipherText.split('=');
        const decryptedData = decrypt(dataValue[1], this.CRYPTOKEY, this.IVKEY);
        const res = str2data(decryptedData);

        console.log('READY_DATA', res)

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
        const result = await this._doReady(readyData)

        const { RETURNCODE: code, RETURNMSG: message } = result;

        if (code !== DANAL_VALUES.SUCCESS_CODE) {
            throw new Error(PAYMENT_ERROR.REQUEST_PAYMENT_WITH_CODE(code, message));
        }

        return result;
    }

    async cpcgi(data: any) {
        console.log('POST CPCGI', data)
        const returnParams = data['RETURNPARAMS'];
        const paramsString: string = decrypt(returnParams, this.CRYPTOKEY, this.IVKEY);
        const params = str2data(paramsString);

        console.log('RETURNPARAMS', params)

        const { RETURNCODE: code, ORDERID: orderId, RETURNMSG: message, TID: tid } = params;

        if (code !== DANAL_VALUES.SUCCESS_CODE) {
            await this._updateOrder(orderId, PAYMENT_STATUS.PAYMENT_FAIL, params);
            throw new Error(PAYMENT_ERROR.RESPONSE_PAYMENT_WITH_CODE(code, message));
        }

        const order = await this.orderService.getOrder({orderId})

        if (order?.status !== PAYMENT_STATUS.PENDING) {
            throw new Error(PAYMENT_ERROR.PAYMENT_ALREADY_PROCESSED);
        }

        const requestData = new Map();

        const amount = order.payPoint ? order.totalValue - order.payPoint : order.totalValue;

        requestData.set('CPID', this.CPID);
        requestData.set('TID', tid);
        requestData.set('AMOUNT', amount);
        requestData.set('TXTYPE', DANAL_VALUES.TXTYPE.BANK_TRANSFER.CPCGI);
        requestData.set('SERVICETYPE', DANAL_VALUES.SERVICETYPE.BANK_TRANSFER);

        const cpdata = data2string(requestData);
        const cipherText = urlencode.encode(encrypt(cpdata, this.CRYPTOKEY, this.IVKEY));
        const body = `CPID=${this.CPID}&DATA=${cipherText}`;

        const resData = await callDanalService(DANAL_URLS.CREDIT_CARD, body);

        if (!resData) {
            throw new Error(PAYMENT_ERROR.PROCESSING_PAYMENT);
        }

        const decodeCipherText = urlencode.decode(resData, 'EUC-KR');
        const dataValue = decodeCipherText.split('=');
        const decryptedData = decrypt(dataValue[1], this.CRYPTOKEY, this.IVKEY);
        const res = str2data(decryptedData);

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

        await this._updateOrder(+orderId, PAYMENT_STATUS.COMPLETED, data);

        return data;
    }

    async cancel(orderId: string) {
        console.log('GET CANCEL', orderId);
        await this._updateOrder(+orderId, PAYMENT_STATUS.CANCELLED, '');

        return;
    }
}


