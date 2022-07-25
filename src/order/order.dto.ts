import { IsNumber, IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PAYMENT_STATUS } from './order.const';

export class OrderDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

export class UpdateDataDto {
    @IsString()
    @IsIn(Object.values(PAYMENT_STATUS))
    status: string;
  
    @IsString()
    @IsOptional()
    paymentData?: string;
  }