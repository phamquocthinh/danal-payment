import * as urlencode from 'urlencode';
import { createCipheriv, createDecipheriv } from 'crypto';

export const str2data = (qs: string): Record<string, any> => {
    const chunks = qs.split('&');
    const result = {};

    chunks.forEach(chunk => {
        const [key, value] = chunk.split('=');
        const decoded = urlencode.decode(value, 'EUC-KR');
        result[key] = decoded;
    });

    return result;
}

export const data2string = (mapobj: Record<string, any>): string => {
    let sb = '';

    mapobj.forEach((value: any, key: string) => {
        sb += key;
        sb += '=';
        sb += urlencode.encode(value);
        sb += '&';
    });

    return sb;
}

export const encrypt = (plainText: string, key: Buffer, iv: Buffer): string => {
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let cip = cipher.update(plainText, 'utf8', 'base64')
    cip += cipher.final('base64');

    return cip;
};

export const decrypt = (messagebase64: any, key: Buffer, iv: Buffer): string => {
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let dec = decipher.update(messagebase64, 'base64').toString();
    dec += decipher.final();

    return dec;
}