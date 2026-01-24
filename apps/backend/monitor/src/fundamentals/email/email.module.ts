/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { DynamicModule, Global, Module } from '@nestjs/common'
import { createTransport } from 'nodemailer'

@Global()
@Module({})
export class EmailModule {
    static forRoot(options: { host: string; port: number; secure: boolean; auth: { user: string; pass: string } }): DynamicModule {
        return {
            module: EmailModule,
            providers: [
                {
                    provide: 'EMAIL_CLIENT',
                    useFactory: () => {
                        // 确保只初始化一次客户端
                        const transporter = createTransport(options)
                        return transporter
                    },
                },
            ],
            exports: ['EMAIL_CLIENT'],
        }
    }
}
