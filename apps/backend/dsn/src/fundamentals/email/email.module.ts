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
