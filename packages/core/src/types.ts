import { Transport } from "./transport";

/**
 * 继承接口
 * 基于插件化机制设计
 */
export interface IIntegration {
  init(transport: Transport): void
}


/**
 * 采集插件基类
 */
export class Integration implements IIntegration {

  constructor(private callback: () => void) {}

  transport: Transport | null = null

  init(transport: Transport) {
    this.transport = transport
  }
}

/*
 * 监控配置
 */
export interface MonitoringOptions {
  dsn: string;                      // 上报地址
  watchWhiteScreen?: boolean;       // 是否开启白屏监控
  whiteBoxElements?: string[];      // 白屏监控容器元素选择器
  integrations?: Integration[]      // 自定义插件列表
  recordUserError?: boolean;        // 是否开启用户错误录制
}