import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as urlencode from 'urlencode';
import fetch from 'fetch';
import {
    str2data,
    data2string,
    encrypt,
    decrypt
} from 'src/util';


@Injectable()
export class DanalCreditCardService {
    private CPID: string;
    private CRYPTOKEY: Buffer;
    private IVKEY: Buffer;
    private DN_CREDIT_URL: string = 'https://tx-creditcard.danalpay.com/credit/';

    constructor(
        private configService: ConfigService,
    ) {
        this.CPID = this.configService.get<string>('DANAL_CPID');
        this.CRYPTOKEY = Buffer.from(this.configService.get<string>('DANAL_CRYPTOKEY'), 'hex');
        this.IVKEY = Buffer.from(this.configService.get<string>('DANAL_IVKEY'), 'hex');
    }

    private _readyData() {
        try {
            /******************************************************
             *  RETURNURL 	: CPCGI페이지의 Full URL
             *  CANCELURL 	: BackURL페이지의 Full URL
             ******************************************************/
            const RETURNURL = "http://localhost/payment/CPCGI";
            const CANCELURL = "http://localhost/payment/cancel";

            const TEST_AMOUNT = "301";
            const REQ_DATA = new Map();
            /**************************************************
             * SubCP 정보
             **************************************************/
            REQ_DATA.set("SUBCPID", "");
            /**************************************************
             * 결제 정보
             **************************************************/
            REQ_DATA.set("AMOUNT", TEST_AMOUNT);
            REQ_DATA.set("CURRENCY", "410");
            REQ_DATA.set("ITEMNAME", "TestItem");
            REQ_DATA.set("USERAGENT", "WP");
            REQ_DATA.set("ORDERID", "Danal_202105141445436615376");
            REQ_DATA.set("OFFERPERIOD", "2015102920151129");
            /**************************************************
             * 고객 정보
             **************************************************/
            REQ_DATA.set("USERNAME", "kisookang");  // 구매자 이름
            REQ_DATA.set("USERID", "userid");       // 사용자 ID
            REQ_DATA.set("USEREMAIL", "useremail"); // 소보법 email수신처
            /**************************************************
             * URL 정보
             **************************************************/
            REQ_DATA.set("CANCELURL", CANCELURL);
            REQ_DATA.set("RETURNURL", RETURNURL);
            /**************************************************
             * 기본 정보
             **************************************************/
            REQ_DATA.set("TXTYPE", "AUTH");
            REQ_DATA.set("SERVICETYPE", "DANALCARD");
            REQ_DATA.set("ISNOTI", "N");
            REQ_DATA.set("BYPASSVALUE", "this=is;a=test;bypass=value");
            // BILL응답 또는 Noti에서 돌려받을 값. '&'를 사용할 경우 값이 잘리게되므로 유의.

            var cpdata = data2string(REQ_DATA);
            var cipherText = urlencode.encode(encrypt(cpdata, this.CRYPTOKEY, this.IVKEY));
            console.log(cipherText);
            return cipherText;

        } catch (error) {
            console.error(error);
            return "error";
        }
    }

    async _doReady(readyData) {
        try {
            /**********************************************************
             * Request for Ready
             * aSync callback 방식으로 호출하고 싶으면 reqPost 함수를 호출한다. 
             * 단, Sync 시 복호화는 callback 에서 처리한다. 
             * 여기서는 순차적으로 진행되어야 하므로 SyncreqPostcp 함수를 사용한다.   
             * Sync Request Post
            ************************************************************/
            const url = `${this.DN_CREDIT_URL}?CPID=${this.CPID}&DATA=${readyData}`;
            const resData = await (await fetch(this.DN_CREDIT_URL, {
                method: 'POST'
            })).text();

            /**************************************************
             * 응답데이터 처리 
             * urldecode - DATA 값 획득 - 복호화 - base64decode  
            **************************************************/
            const decodeCipherText = urlencode.decode(resData, 'EUC-KR');
            const dataValue = decodeCipherText.split('=');
            var decryptedData = decrypt(dataValue[1], this.CRYPTOKEY, this.IVKEY);

            //파라미터별 데이터 분리 후 UrlDecode
            var res = str2data(decryptedData);

            return res;

        } catch (error) {
            console.error(error);
            return "error";
        }
    }

    async order() {

    }

    async ready() {
        const readyData = this._readyData();
        const result = await this._doReady(readyData);

        return result;
    }
}
