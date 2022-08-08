import * as urlencode from 'urlencode';
import * as util from 'util';
import * as child from 'child_process';
import { createCipheriv, createDecipheriv } from 'crypto';
import fetch, { Request, Response, FetchError } from 'node-fetch';

const exec = util.promisify(child.exec);

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

export const callDanalService = async(url: string, data?: string): Promise<string | false> => {
    const options: Request = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=euc-kr',
        },
    }

    if (data) {
        options.body = data;
    }

    return fetch(url, options)
        .then((response: Response) => {
            return response.text();
        })
        .catch((error: FetchError) => {
            console.log(error)
            return false;
        });
}

export const callTeleditService = async(command: string): Promise<string | false> => {
    const { stdout, stderr } = await exec(command);

    if (stderr) {
        console.log(stderr);
        return false;
    }

    return stdout;
}

export const makeItemInfo = (amount: number, orderId: number | string, itemName: string): string => {
    const stringOrderId = orderId.toString();

    return `${stringOrderId.substring(0, 1)}|${amount}|1|${stringOrderId}|${itemName}`;
}

export const makeTeleditParams = (data: any): string => {
    const arrayData = [];

    data.forEach((value, key) => {
        arrayData.push(`${key}=${value}`);
    })

    return arrayData.join(';');
}

export const parseTeleditResponse = (data: string): Record<string, string> => {
    const result: Record<string, string> = {};

    data.split("\n").forEach(str => {
        console.log('string', str)
        const [key, value] = str.split("=");
        console.log(key, value)
        
        if (key && value) {
            result[key] = value.trim();
        }
    })

    return result;
}