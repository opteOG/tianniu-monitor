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
  dsn: string;
  integrations?: Integration[]
}