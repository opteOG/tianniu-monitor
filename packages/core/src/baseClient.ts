import { Transport } from './transport'
import { MonitoringOptions } from './types'

// 获取当前传输层协议
export let getTransport: () => Transport | null = () => null

/**
 * 监控基类
 * 提供基础的上报功能
 * 1. 上报消息
 * 2. 上报事件
 */
export class Monitoring {
  private transport: Transport | null = null

  constructor(private options: MonitoringOptions) {}

  init(transport: Transport) {
    this.transport = transport
    getTransport = () => transport
    // 按顺序初始化插件
    this.options.integrations?.forEach(integration => {
      integration.init(transport)
    })
  }
  // 上报消息
  reportMessage(message: string) {
    this.transport?.send({ type: 'message', message })
  }
  // 上报事件
  reportEvent(event: unknown) {
    this.transport?.send({ type: 'event', event })
  }
}
