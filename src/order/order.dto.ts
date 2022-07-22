import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

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
