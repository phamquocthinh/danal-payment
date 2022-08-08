export const DOMAIN = 'https://testsme.danalenter.co.kr/payment'

export const DANAL_VALUES = {
    SUCCESS_CODE: '0000',
    CURRENCY: {
        WON: '410',
        USD: '840',
    },
    ITEMNAME: 'Product',
    USERAGENT: {
        CREDIT_CARD: {
            PC: 'WP',
            MOBILE: 'WM',
            ANDROID: 'WA',
            IOS: 'WI',
        },
        BANK_TRANSFER: {
            PC: 'PC',
            MOBILE: 'MW',
            ANDROID: 'MA',
            IOS: 'MI',
        },
        VACCOUNT: {
            PC: 'PC',
            MOBILE: 'MW',
            ANDROID: 'MA',
            IOS: 'MI',
        },
    },
    TXTYPE: {
        CREDIT_CARD: {
            READY: 'AUTH',
            CPCGI: 'BILL',
        },
        BANK_TRANSFER: {
            READY: 'AUTH',
            CPCGI: 'BILL',
        },
        VACCOUNT: {
            READY: 'AUTH',
            CPCGI: 'ISSUEVACCOUNT',
        },
    },
    SERVICETYPE: {
        CREDIT_CARD: 'DANALCARD',
        BANK_TRANSFER: 'WIRETRANSFER',
        VACCOUNT: 'DANALVACCOUNT',
    },
    ISNOTI: 'N',
    QUOTA: {
        NORMAL: '00',
        //installment code from 02~36
    },
    LAYOUT: {
        COLOR: '',
        CIURL: ''
    }
}

export const MIN_ORDER_AMOUNT: number = 100; // min amount 100W

export const DANAL_URLS = {
    CREDIT_CARD: 'https://tx-creditcard.danalpay.com/credit/',
    BANK_TRANSFER: 'https://tx-wiretransfer.danalpay.com/bank/',
    VACCOUNT: 'https://tx-vaccount.danalpay.com/vaccount/',
}
