import { ClickHouseClient } from '@clickhouse/client'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { EmailService } from '../email/email.service'

type BaseMonitorStorageRow = {
  app_id: string
  info: string
  created_at: string
  event_type: string
  message: string
}

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
      ...values,
    }

    if (event_type === 'error') {
      Logger.log('监听到了错误')
      // 发送错误告警邮件
      try {
        await this.emailService.alert({
          to: 'm19196427121@163.com',
          subject: '错误告警',
          params: alertParams,
        })
        // Logger.log('Error alert job added to queue')
      } catch (error) {
        Logger.log('error alert job failed', error)
      }
    }
  }

  // 获取对应app_id下的event_type的所有数据
  async getEventTypeAllData(app_id: string, event_type: string): Promise<BaseMonitorStorageRow[]> {
    const resultSet = await this.clickhouseClient.query({
      query: `
        SELECT
          app_id,
          info,
          created_at,
          event_type,
          message
        FROM tianniu.base_monitor_storage
        WHERE app_id = {app_id:String} AND event_type = {event_type:String}
        ORDER BY created_at DESC
      `,
      query_params: {
        app_id,
        event_type,
      },
      format: 'JSONEachRow',
    })

    const rows = (await resultSet.json()) as unknown
    if (!Array.isArray(rows)) return []
    return rows as BaseMonitorStorageRow[]
  }
}
