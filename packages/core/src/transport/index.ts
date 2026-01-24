/**
 * 数据上报接口
 * 为了适配不同的终端（游览器、Node等）
 */
export interface Transport {
  send: (data: Record<string, unknown>) => void
}