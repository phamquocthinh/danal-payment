import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'API_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        queue: configService.get<string>('RMQ_QUEUE'),
                        urls: [configService.get<string>('RMQ_URL')],
                        queueOptions: { durable: true },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule { }
