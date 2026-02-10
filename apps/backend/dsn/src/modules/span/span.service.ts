import { ClickHouseClient } from '@clickhouse/client'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { EmailService } from '../email/email.service'
import { GetOverviewDto } from './span.dto';

@Injectable()
export class SpanService {
  constructor(
    @Inject('CLICKHOUSE_CLIENT') private clickhouseClient: ClickHouseClient,
    private readonly emailService: EmailService
  ) {}

  async tracking(app_id: string, params: { event_type: string; message?: string }) {
    const { event_type, message, ...rest } = params
    const values = {
      app_id,
      event_type,
      message,
      info: rest,
    }
    const res = await this.clickhouseClient.insert({
      table: 'tianniu.base_monitor_storage',
      values,
      columns: ['app_id', 'event_type', 'message', 'info'],
      format: 'JSONEachRow',
    })

    const alertParams = {
      ...params,
      ...values
    }

    if (event_type === 'error') {
      Logger.log('监听到了错误')
      // 发送错误告警邮件
      try {
        await this.emailService.alert({
          to: 'm19196427121@163.com',
          subject: '错误告警',
          params: alertParams
        })
        // Logger.log('Error alert job added to queue')
      }
      catch (error) {
        Logger.log('error alert job failed', error)
      }
    }
  }

  async getOverview(params: GetOverviewDto) {
    const { appId, granularity } = params
  }
}
