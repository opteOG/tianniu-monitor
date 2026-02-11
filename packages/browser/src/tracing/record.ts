import { pack } from '@rrweb/packer'
import { record } from '@rrweb/record'
import type { eventWithTime } from '@rrweb/types'
import { Transport } from '@tianniu-monitor/monitor-core'

interface RecordPayload {
  event_type: 'record'
  // rrweb 事件序列（仅包含最近 10s 内事件）
  events: string
  // 触发本次上报的错误信息
  message: string
  // 发生错误时的页面路径
  path: string
  // 可选：错误堆栈
  stack?: string
}

// 错误录制插件：使用 rrweb 录制用户行为，在错误发生时回传最近 10s 的录制数据
export class RecordIntegration {
  // 页面是否已进入可录制状态（DOMContentLoaded 或 load 完成）
  private isPageReady = false
  // 使用二维数组存储 rrweb 事件：每次 checkout（全量快照）开启一个新的分段
  private eventsMatrix: eventWithTime[][] = [[]]
  // 限制内存：最多保留多少条事件（超过时从最早的分段开始丢弃）
  private MAX_EVENT_COUNT = 300
  // rrweb 每累计 N 条事件触发一次 checkout（生成新的快照分段）
  private checkoutEveryNth = 200
  private stopFn: (() => void) | undefined = undefined

  constructor(private transport: Transport) {}

  init() {
    this.checkPageReady()
    // 先注册错误监听，确保即使在 load 前发生错误也能触发上报
    this.monitorUserError()
    if (this.isPageReady) {
      this.beginRecord()
    } else {
      window.addEventListener('load', () => {
        this.beginRecord()
      })
    }

    window.addEventListener('unload', () => {
      this.stopFn?.()
    })
    window.addEventListener('pagehide', () => {
      this.stopFn?.()
    })
  }

  // 开始录制
  beginRecord() {
    if (this.stopFn) return
    this.stopFn = record({
      // 使用箭头函数，避免 rrweb 调用时 this 丢失
      emit: this.emit,
      // 每 N 条 event 生成一次新的快照分段，便于截取最近事件时仍能包含必要的快照
      checkoutEveryNth: this.checkoutEveryNth,
      // 屏蔽所有输入框内容，防止用户隐私泄露
      maskAllInputs: true,
      // 仅在页面加载完成后开始录制
      recordAfter: 'load',
      // 对事件进行压缩
      packFn: pack,
    })
  }

  // rrweb 事件回调：按 checkout 分段存储，同时做总量裁剪
  private emit = (event: eventWithTime, isCheckout?: boolean): void => {
    if (isCheckout) {
      this.eventsMatrix.push([])
    }
    const lastEvents = this.eventsMatrix[this.eventsMatrix.length - 1]
    lastEvents?.push(event)
    this.trimOldEvents()
  }

  // 判断页面是否加载完成
  checkPageReady() {
    const nav = performance && (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
    if (nav?.domContentLoadedEventEnd) {
      this.isPageReady = true
    }
    if (document.readyState === 'complete') {
      this.isPageReady = true
    }
  }

  // 监控用户行为报错
  monitorUserError() {
    // 监听全局错误：使用 addEventListener 避免覆盖其他插件（如 Errors）的 onerror
    window.addEventListener(
      'error',
      (event: Event) => {
        const errorEvent = event as ErrorEvent
        const message = typeof errorEvent?.message === 'string' ? errorEvent.message : String(event)
        const payload: RecordPayload = {
          event_type: 'record',
          // 仅上报最近 10s 内事件，降低体积并聚焦问题窗口
          events: JSON.stringify(this.collectRecentEvents(1000 * 10)),
          message,
          path: window.location.pathname,
          stack: errorEvent?.error?.stack,
        }
        this.transport.send({ ...payload })
        // 上报后清空缓存，避免后续错误带上过长历史
        this.resetEvents()
      },
      { capture: true }
    )

    // 监听未处理的 Promise 拒绝事件（unhandledrejection）
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reason = event.reason as any
      const message = reason?.message ? String(reason.message) : reason ? String(reason) : ''
      const stack = reason?.stack ? String(reason.stack) : undefined
      const payload: RecordPayload = {
        event_type: 'record',
        // 仅上报最近 10s 内事件
        events: JSON.stringify(this.collectRecentEvents(1000 * 10)),
        message,
        path: window.location.pathname,
        stack,
      }
      this.transport.send({ ...payload })
      this.resetEvents()
    })
  }

  // 从 eventsMatrix 中筛选最近 windowMs 内的 rrweb 事件（按 timestamp 过滤）
  private collectRecentEvents(windowMs: number) {
    const cutoff = Date.now() - windowMs
    const events: eventWithTime[] = []
    for (const segment of this.eventsMatrix) {
      for (const event of segment) {
        if ((event?.timestamp ?? 0) >= cutoff) {
          events.push(event)
        }
      }
    }
    return events
  }

  // 总量裁剪：超过 MAX_EVENT_COUNT 时从最早分段开始丢弃，保证内存上限
  private trimOldEvents() {
    let total = 0
    for (const segment of this.eventsMatrix) {
      total += segment.length
    }
    while (total > this.MAX_EVENT_COUNT) {
      const first = this.eventsMatrix[0]
      if (!first || first.length === 0) {
        if (this.eventsMatrix.length > 1) {
          this.eventsMatrix.shift()
        } else {
          break
        }
        continue
      }
      first.shift()
      total--
      if (first.length === 0 && this.eventsMatrix.length > 1) {
        this.eventsMatrix.shift()
      }
    }
  }

  // 重置为初始状态（保留一个空分段）
  private resetEvents() {
    this.eventsMatrix = [[]]
  }
}
