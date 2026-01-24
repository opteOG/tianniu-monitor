/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { createClient } from '@clickhouse/client'
import { DynamicModule, Global, Module } from '@nestjs/common'

@Global()
@Module({})
export class ClickhouseModule {
    static forRoot(options: { url: string; username: string; password: string }): DynamicModule {
        return {
            module: ClickhouseModule,
            providers: [
                {
                    provide: 'CLICKHOUSE_CLIENT',
                    useFactory: () => {
                        // 确保只初始化一次客户端
                        return createClient(options)
                    },
                },
            ],
            exports: ['CLICKHOUSE_CLIENT'],
        }
    }
}
