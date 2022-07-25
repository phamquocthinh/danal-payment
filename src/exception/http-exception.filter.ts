import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { DEFAULT_ERROR_MESSAGE } from 'src/common/common.const';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception.message.message)
    console.log(exception.stack)
    const message = exception?.message || DEFAULT_ERROR_MESSAGE

    response.render('error', { message });
  }
}