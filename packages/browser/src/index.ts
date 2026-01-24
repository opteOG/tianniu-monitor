import { Metrics } from "@tianniu-monitor/browser-utils";
import { Monitoring, MonitoringOptions } from "@tianniu-monitor/monitor-core";
import { BrowserTransport } from "./transport/transport";
import { Errors } from "./tracing/errorIntegration";

/**
 * 初始化浏览器监控
 * @param options 监控配置选项
 * @returns 监控实例
 */
export function init(options: MonitoringOptions) {
  const { dsn, integrations = [] } = options
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



  return monitoring
}