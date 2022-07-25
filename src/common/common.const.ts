export const DANAL_VALUES = {
    SUCCESS_CODE: '0000',
    CURRENCY: {
        WON: '410',
        USD: '840',
    },
    ITEMNAME: 'Product',
    USERAGENT: {
        PC: 'WC',
        MOBILE: 'WM',
        ANDROID: 'WA',
        IOS: 'WI',
    },
    TXTYPE: 'AUTH',
    SERVICETYPE: {
        CREDIT_CARD: 'DANALCARD',
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

export const DANAL_URLS = {
    CREDIT_CARD: 'https://tx-creditcard.danalpay.com/credit/',
}

export const DEFAULT_ERROR_MESSAGE = `An error occurred while processing payment\nPlease try again later or contact the administrator`