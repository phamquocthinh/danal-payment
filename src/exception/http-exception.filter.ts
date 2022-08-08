import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { DEFAULT_ERROR_MESSAGE } from 'src/common/common.error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception?.message || DEFAULT_ERROR_MESSAGE;

    return response.render('error', { message });
  }
}