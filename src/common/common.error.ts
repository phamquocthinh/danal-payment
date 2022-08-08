export const DEFAULT_ERROR_MESSAGE = 'An error occurred while processing payment request.';

export const PAYMENT_ERROR = {
    ORDER_NOT_FOUND: 'Order not found',
    INVALID_AMOUNT: (min: number) => `Invalid amount, Must be greater than ${min}`,
    REQUEST_PAYMENT: 'An error occurred while calling Danal Service',
    REQUEST_PAYMENT_WITH_CODE: (code: string, message: string) => `Request payment error with code ${code}: ${message || ''}`,
    RESPONSE_PAYMENT_WITH_CODE: (code: string, message: string) => `Response payment error with code ${code}: ${message || ''}`,
    PAYMENT_ALREADY_PROCESSED: 'Payment already processed',
    PROCESSING_PAYMENT: 'An error occurred while sending payment request to Danal Service',
}