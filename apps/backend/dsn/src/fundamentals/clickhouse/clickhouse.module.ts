import { DynamicModule, Global, Module } from "@nestjs/common";
import { createClient } from "@clickhouse/client";

@Global()
@Module({})
export class ClickhouseModule {
  static forRoot(options: { url: string, username: string, password: string }): DynamicModule {
    return {
      module: ClickhouseModule,
      providers: [
        {
          provide: 'CLICKHOUSE_CLIENT',
          useFactory: () => {
            // 创建 clickhouse 客户端
            return createClient(options)
          }
        }
      ],
      exports: ['CLICKHOUSE_CLIENT']
    }
  }
}