import { Metrics, WhiteScreenIntegration } from '@tianniu-monitor/browser-utils'
import { Monitoring, MonitoringOptions } from '@tianniu-monitor/monitor-core'
import { BrowserTransport } from './transport/transport'
import { Errors } from './tracing/errorIntegration'
import { RecordIntegration } from './tracing/record'

/**
 * 初始化浏览器监控
 * @param options 监控配置选项
 * @returns 监控实例
 */
export function init(options: MonitoringOptions) {
  const { dsn, integrations = [], watchWhiteScreen = false, whiteBoxElements = [], recordUserError = false } = options
  // 初始化监控
  const monitoring = new Monitoring(options)
  // 初始化传输层
  const transport = new BrowserTransport(dsn)
  // 初始化外部插件
  monitoring.init(transport)
  // 内部默认初始化性能指标插件
  new Metrics(transport).init()
  // 初始化错误插件
  new Errors(transport).init()
  // 初始化白屏监控插件
  watchWhiteScreen && new WhiteScreenIntegration(transport, whiteBoxElements).init()
  // 初始化错误录制插件
  recordUserError && new RecordIntegration(transport).init()
  // 初始化自定义插件
  integrations.forEach(integration => integration.init(transport))

  
  return monitoring
}
