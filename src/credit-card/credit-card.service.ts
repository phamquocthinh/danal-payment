import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as urlencode from 'urlencode';
import * as fetch from 'node-fetch';

import {
    str2data,
    data2string,
    encrypt,
    decrypt
} from 'src/util';

import { OrderService } from 'src/order/order.service';


@Injectable()
export class DanalCreditCardService {
    private CPID: string;
    private CRYPTOKEY: Buffer;
    private IVKEY: Buffer;
    private DN_CREDIT_URL: string = 'https://tx-creditcard.danalpay.com/credit/';

    constructor(
        private orderService: OrderService,
        private configService: ConfigService,
    ) {
        this.CPID = this.configService.get<string>('DANAL_CPID');
        this.CRYPTOKEY = Buffer.from(this.configService.get<string>('DANAL_CRYPTOKEY'), 'hex');
        this.IVKEY = Buffer.from(this.configService.get<string>('DANAL_IVKEY'), 'hex');
    }

    private _readyData(orderData: Record<string, any>): string {
        const RETURNURL = 'https://phpstack-805617-2760205.cloudwaysapps.com/CPCGI.php';
            const CANCELURL = 'https://phpstack-805617-2760205.cloudwaysapps.com/Cancel.php';

            const requestData = new Map();
            /**************************************************
             * SubCP 정보
             **************************************************/
            requestData.set('SUBCPID', '');
            /**************************************************
             * 결제 정보
             **************************************************/
            requestData.set('AMOUNT', orderData.totalValue);
            requestData.set('CURRENCY', '410');
            requestData.set('ITEMNAME', 'Product');
            requestData.set('USERAGENT', 'WM');
            requestData.set('ORDERID', orderData.id);
            /**************************************************
             * 고객 정보
             **************************************************/
            requestData.set('USERNAME', orderData.user.nickname);  // 구매자 이름
            requestData.set('USERID', orderData.user.id);       // 사용자 ID
            requestData.set('USEREMAIL', orderData.user.email); // 소보법 email수신처
            /**************************************************
             * URL 정보
             **************************************************/
            requestData.set('CANCELURL', CANCELURL);
            requestData.set('RETURNURL', RETURNURL);
            /**************************************************
             * 기본 정보
             **************************************************/
            requestData.set('TXTYPE', 'AUTH');
            requestData.set('SERVICETYPE', 'DANALCARD');
            requestData.set('ISNOTI', 'N');
            requestData.set('BYPASSVALUE', 'this=is;a=test;bypass=value');
            // BILL응답 또는 Noti에서 돌려받을 값. '&'를 사용할 경우 값이 잘리게되므로 유의.

            const cpdata = data2string(requestData);
            const cipherText = urlencode.encode(encrypt(cpdata, this.CRYPTOKEY, this.IVKEY));

            return cipherText;
    }

    private async _doReady(readyData: string) {
        /**********************************************************
             * Request for Ready
             * aSync callback 방식으로 호출하고 싶으면 reqPost 함수를 호출한다. 
             * 단, Sync 시 복호화는 callback 에서 처리한다. 
             * 여기서는 순차적으로 진행되어야 하므로 SyncreqPostcp 함수를 사용한다.   
             * Sync Request Post
            ************************************************************/
         const url = `${this.DN_CREDIT_URL}?CPID=${this.CPID}&DATA=${readyData}`;
         const resData = await (await fetch(url, {
             method: 'POST'
         })).text();

         /**************************************************
          * 응답데이터 처리 
          * urldecode - DATA 값 획득 - 복호화 - base64decode  
         **************************************************/
         const decodeCipherText = urlencode.decode(resData, 'EUC-KR');
         const dataValue = decodeCipherText.split('=');
         const decryptedData = decrypt(dataValue[1], this.CRYPTOKEY, this.IVKEY);

         //파라미터별 데이터 분리 후 UrlDecode
         const res = str2data(decryptedData);

         console.log(res)

         return res;
    }

    async ready(data) {
        const orderData = await this.orderService.getOrder(data)
        const readyData = this._readyData(orderData);
        const result = await this._doReady(readyData);

        return result;
    }
}
