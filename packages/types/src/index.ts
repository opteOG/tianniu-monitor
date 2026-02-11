// Promise 未处理拒绝错误
export interface UnhandledRejectionErrorPayload {
  event_type: string
  stack: string
  message: string | Event
  path: string
}
// Vue 错误
export interface VueErrorPayload {
  event_type: string
  err: unknown
  vm: any
  info: string
}
// 性能指标
export interface PerformanceWebVitalPayload {
  event_type: 'performance'
  type: 'web_vital'
  name: string
  value: number
  path: string
}
// 白屏错误
export interface WhiteScreenPayload {
  event_type: 'whiteScreen'
  path: string
}
// 录屏上报
export interface RecordPayload {
  event_type: 'record'
  events: string
  message: string
  path: string
  stack?: string
}
// React 错误
export type ReactErrorPayload = {
  event_type: 'error'
  type: 'react_error'
  message: string
  stack?: string
  componentStack?: string
  path: string
} & Record<string, unknown>

export type PluginReportPayload =
  | UnhandledRejectionErrorPayload
  | VueErrorPayload
  | PerformanceWebVitalPayload
  | WhiteScreenPayload
  | RecordPayload
  | ReactErrorPayload

