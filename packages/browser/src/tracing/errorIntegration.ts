import { Transport } from '@tianniu-monitor/monitor-core'

export interface UnhandledRejectionErrorPayload {
  event_type: string
  stack: string
  message: string | Event
  path: string
}

export class Errors {
  constructor(private transport: Transport) {}

  init() {
    // 监听全局错误
    window.addEventListener('error', (event) => {
      const payload: UnhandledRejectionErrorPayload = {
        event_type: 'error',
        stack: event?.error?.stack || '',
        message: event?.error?.message || '',
        path: window.location.pathname,
      }
      this.transport.send({ ...payload })
    })

    // 监听未处理的 Promise 拒绝事件
    window.addEventListener('unhandledrejection', (event) => {
      const payload: UnhandledRejectionErrorPayload = {
        event_type: 'error',
        stack: event?.reason?.stack || '',
        message: event?.reason?.message || '',
        path: window.location.pathname,
      }
      this.transport.send({ ...payload })
    })
  }
}
