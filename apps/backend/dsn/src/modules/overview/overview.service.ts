import { Injectable } from '@nestjs/common'
import type { GetOverviewDto, GetOverviewResponseDto, OverviewCountTrendPointDto, OverviewWebVitalSeriesDto } from './overview.dto'
import { SpanService } from '../span/span.service'

type BaseMonitorStorageRow = {
  app_id: string
  info: string
  created_at: string
  event_type: string
  message: string
}

@Injectable()
export class OverviewService {
  constructor(private spanService: SpanService) {}

  async getOverview(query: GetOverviewDto): Promise<GetOverviewResponseDto> {
    const { appId, granularity, startTime, endTime } = query

    const [errorRows, vueErrorRows, whiteScreenRows, recordRows, performanceRows] = await Promise.all([
      this.spanService.getEventTypeAllData(appId, 'error'),
      this.spanService.getEventTypeAllData(appId, 'vue_error'),
      this.spanService.getEventTypeAllData(appId, 'whiteScreen'),
      this.spanService.getEventTypeAllData(appId, 'record'),
      this.spanService.getEventTypeAllData(appId, 'performance'),
    ])

    const start = this.parseOptionalTime(startTime)
    const end = this.parseOptionalTime(endTime)

    const filteredErrors = this.filterByTime(errorRows, start, end)
    const filteredVueErrors = this.filterByTime(vueErrorRows, start, end)
    const filteredWhiteScreens = this.filterByTime(whiteScreenRows, start, end)
    const filteredRecords = this.filterByTime(recordRows, start, end)
    const filteredPerformance = this.filterByTime(performanceRows, start, end)

    const errorCount = filteredErrors.length + filteredVueErrors.length

    const errorTrend = this.buildCountTrend([...filteredErrors, ...filteredVueErrors], granularity)
    const whiteScreenTrend = this.buildCountTrend(filteredWhiteScreens, granularity)
    const recordTrend = this.buildCountTrend(filteredRecords, granularity)

    const webVitals = this.buildWebVitalSeries(filteredPerformance, granularity)

    return {
      metrics: {
        errorCount,
        whiteScreenCount: filteredWhiteScreens.length,
        recordCount: filteredRecords.length,
        webVitalSampleCount: filteredPerformance.length,
      },
      trends: {
        errors: errorTrend,
        whiteScreens: whiteScreenTrend,
        records: recordTrend,
      },
      webVitals,
    }
  }

  private filterByTime(rows: BaseMonitorStorageRow[], start: Date | null, end: Date | null) {
    if (!start && !end) return rows
    return rows.filter(row => {
      const dt = this.parseClickhouseDateTime(row.created_at)
      if (!dt) return false
      if (start && dt < start) return false
      if (end && dt > end) return false
      return true
    })
  }

  private parseOptionalTime(value?: string): Date | null {
    if (!value) return null
    const dt = new Date(value)
    if (Number.isNaN(dt.getTime())) return null
    return dt
  }

  private parseClickhouseDateTime(value: string): Date | null {
    if (!value) return null
    const normalized = value.includes('T') ? value : value.replace(' ', 'T') + 'Z'
    const dt = new Date(normalized)
    if (Number.isNaN(dt.getTime())) return null
    return dt
  }

  private buildCountTrend(rows: BaseMonitorStorageRow[], granularity: GetOverviewDto['granularity']): OverviewCountTrendPointDto[] {
    const bucketMap = new Map<string, number>()
    for (const row of rows) {
      const dt = this.parseClickhouseDateTime(row.created_at)
      if (!dt) continue
      const bucket = this.getBucketKey(dt, granularity)
      bucketMap.set(bucket, (bucketMap.get(bucket) ?? 0) + 1)
    }

    return [...bucketMap.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([bucket, count]) => ({ bucket, count }))
  }

  private buildWebVitalSeries(rows: BaseMonitorStorageRow[], granularity: GetOverviewDto['granularity']): OverviewWebVitalSeriesDto[] {
    const byNameBucket = new Map<string, number[]>()

    for (const row of rows) {
      const dt = this.parseClickhouseDateTime(row.created_at)
      if (!dt) continue

      const info = this.parseJsonLoose(row.info) ?? this.parseJsonLoose(row.message) ?? null
      if (!info || typeof info !== 'object') continue

      const name = (info as any).name
      const value = (info as any).value
      if (typeof name !== 'string') continue
      const numericValue = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
      if (!Number.isFinite(numericValue)) continue

      const bucket = this.getBucketKey(dt, granularity)
      const key = `${name}@@${bucket}`
      const arr = byNameBucket.get(key) ?? []
      arr.push(numericValue)
      byNameBucket.set(key, arr)
    }

    const seriesMap = new Map<string, { bucket: string; values: number[] }[]>()
    for (const [key, values] of byNameBucket.entries()) {
      const [name, bucket] = key.split('@@')
      if (!name || !bucket) continue
      const list = seriesMap.get(name) ?? []
      list.push({ bucket, values })
      seriesMap.set(name, list)
    }

    return [...seriesMap.entries()]
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([name, points]) => {
        const normalizedPoints = points
          .sort((a, b) => (a.bucket < b.bucket ? -1 : a.bucket > b.bucket ? 1 : 0))
          .map(p => {
            const sorted = [...p.values].sort((x, y) => x - y)
            const count = sorted.length
            return {
              bucket: p.bucket,
              p50: count ? this.quantile(sorted, 0.5) : null,
              p95: count ? this.quantile(sorted, 0.95) : null,
              count,
            }
          })

        return { name, points: normalizedPoints }
      })
  }

  private getBucketKey(date: Date, granularity: GetOverviewDto['granularity']) {
    const y = date.getUTCFullYear()
    const m = String(date.getUTCMonth() + 1).padStart(2, '0')
    const d = String(date.getUTCDate()).padStart(2, '0')
    const hh = String(date.getUTCHours()).padStart(2, '0')

    if (granularity === 'hour') return `${y}-${m}-${d}T${hh}:00:00Z`
    if (granularity === 'day') return `${y}-${m}-${d}`
    if (granularity === 'month') return `${y}-${m}`
    return this.getISOWeekKey(date)
  }

  private getISOWeekKey(date: Date) {
    const tmp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const day = tmp.getUTCDay() || 7
    tmp.setUTCDate(tmp.getUTCDate() + 4 - day)
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
    const week = String(weekNo).padStart(2, '0')
    return `${tmp.getUTCFullYear()}-W${week}`
  }

  private parseJsonLoose(value: string): unknown {
    if (!value) return null
    const trimmed = value.trim()
    if (!trimmed) return null
    try {
      return JSON.parse(trimmed)
    } catch {
      return null
    }
  }

  private quantile(sorted: number[], q: number) {
    if (sorted.length === 0) return 0
    const pos = (sorted.length - 1) * q
    const base = Math.floor(pos)
    const rest = pos - base
    const baseValue = sorted[base] ?? sorted[sorted.length - 1]!
    const nextValue = sorted[base + 1] ?? baseValue
    return baseValue + rest * (nextValue - baseValue)
  }
}
