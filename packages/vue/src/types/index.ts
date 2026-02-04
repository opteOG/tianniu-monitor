import { MonitoringOptions } from '@tianniu-monitor/monitor-core'

export type VueMonitorOptions = MonitoringOptions &
  (
    | {
        reportVueError?: false
        vueInstance?: any
      }
    | {
        reportVueError: true
        vueInstance: any
      }
  )
