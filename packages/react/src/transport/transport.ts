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
    
    if (this.isSupportSendBeacon()) {
      navigator.sendBeacon(this.dsn, JSON.stringify(payload))
    }
    else if (this.isSupportFetch()) {
      fetch(this.dsn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(error => {
        console.error('Error:', error)
      })
    }
    else {
      const img = new Image()
      img.src = `${this.dsn}?data=${encodeURIComponent(JSON.stringify(payload))}`
    }
    
  }

  // 检查浏览器是否支持 sendBeacon 方法
  private isSupportSendBeacon() {
    try {
      return (
        typeof navigator !== 'undefined' &&
        typeof navigator.sendBeacon === 'function'
      )
    }
    catch (error) {
      return false
    }
  }

  // 检查浏览器是否支持 fetch 方法
  private isSupportFetch() {
    try {
      return (
        typeof fetch !== 'undefined' &&
        typeof fetch === 'function'
      )
    }
    catch (error) {
      return false
    }
  }
}
