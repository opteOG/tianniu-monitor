import { getBrowserInfo } from '@tianniu-monitor/browser-utils'
import { Transport } from '@tianniu-monitor/monitor-core'

/**
 * 游览器数据传输协议
 */
export class BrowserTransport implements Transport {
  constructor(private dsn: string) {}

  /**
   * 发送数据
   * @param data 要发送的数据
   */
  send(data: Record<string, unknown>) {
    const browserInfo = getBrowserInfo()
    const payload = {
      ...data,
      browserInfo,
    }
    fetch(this.dsn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(error => {
      console.error('Error:', error)
    })
  }
}
