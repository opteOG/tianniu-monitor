import { onCLS, onFCP, onLCP, onTTFB } from '../metrics'
import type { Transport } from '@tianniu-monitor/monitor-core'

export const onload = (callback: (metrics: { name: string; value: number }) => void) => {
  // 获取所有导航条目的数据
  const navigationEntries = performance.getEntriesByType('navigation')

  if (navigationEntries.length > 0) {
    const entry = navigationEntries[0] as PerformanceNavigationTiming

    // 计算页面加载时长
    let loadTime = entry ? entry.loadEventEnd - entry.startTime : 10

    if (loadTime <= 0) {
      loadTime = performance.now()
    }

    callback({ name: 'LOAD', value: loadTime })
  } else {
    // 如果没有导航条目，使用 performance.now() 作为备选
    const loadTime = performance.now()

    callback({ name: 'LOAD', value: loadTime })
  }
}

// 性能指标采集插件
export class Metrics {
  constructor(private transport: Transport) {}

  init() {
    window.addEventListener('load', () => {
      ;[onCLS, onLCP, onFCP, onTTFB, onload].forEach(metricsFn => {
        // 数据上报
        metricsFn(metrics => {
          this.transport.send({
            event_type: 'performance',
            type: 'web_vital',
            name: metrics.name,
            value: metrics.value,
            path: window.location.pathname,
          })
        })
      })
    })
  }
}
