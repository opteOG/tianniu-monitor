import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SpanModule } from './modules/span/span.module'
import { ClickhouseModule } from './fundamentals/clickhouse/clickhouse.module'
import { EmailModule } from './fundamentals/email/email.module'

@Module({
  imports: [
    SpanModule,
    ClickhouseModule.forRoot({
      url: 'http://localhost:8123', // ClickHouse 服务地址
      username: 'tianniu', // ClickHouse 用户名
      password: 'tianniu123', // ClickHouse 密码
    }),
    EmailModule.forRoot({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: 'm19196427121@163.com',
        pass: 'GPrmZ7djeZwsWNif',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
