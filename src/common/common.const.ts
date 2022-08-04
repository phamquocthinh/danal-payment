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
        }
    },
    TXTYPE: 'AUTH',
    SERVICETYPE: {
        CREDIT_CARD: 'DANALCARD',
        BANK_TRANSFER: 'WIRETRANSFER',
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
    BANK_TRANSFER: 'https://tx-wiretransfer.danalpay.com/bank/'
}

export const DEFAULT_ERROR_MESSAGE = `An error occurred while processing payment\nPlease try again later or contact the administrator`