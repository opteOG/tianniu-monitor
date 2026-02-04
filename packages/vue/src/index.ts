import { Metrics, whiteScreenIntegration } from "@tianniu-monitor/browser-utils";
import { Monitoring } from "@tianniu-monitor/monitor-core";
import { BrowserTransport } from "./transport/transport";
import { Errors } from "./tracing/errorIntegration";
import { VueMonitorOptions } from "./types";

/**
 * 初始化浏览器监控
 * @param options 监控配置选项
 * @returns 监控实例
 */
export function init(options: VueMonitorOptions) {
  const { dsn, integrations = [], watchWhiteScreen = false, whiteBoxElements = [], reportVueError = false, vueInstance } = options
  // 初始化监控
  const monitoring = new Monitoring(options)
  // 初始化传输层
  const transport = new BrowserTransport(dsn)
  // 初始化外部插件
  monitoring.init(transport)
  // 内部默认初始化性能指标插件
  new Metrics(transport).init()
  // 初始化错误插件
  reportVueError ? new Errors(transport).init(vueInstance) : new Errors(transport).init()
  // 初始化白屏监控插件
  watchWhiteScreen && new whiteScreenIntegration(transport, whiteBoxElements).init()



  return monitoring
}