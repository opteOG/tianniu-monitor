import { z } from 'zod'

export const getOverviewSchema = z.object({
  appId: z.string(),
  granularity: z.enum(['hour', 'day', 'week', 'month']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type GetOverviewDto = z.infer<typeof getOverviewSchema>

export interface OverviewMetricsDto {
  errorCount: number
  whiteScreenCount: number
  recordCount: number
  webVitalSampleCount: number
}

export interface OverviewCountTrendPointDto {
  bucket: string
  count: number
}

export interface OverviewWebVitalTrendPointDto {
  bucket: string
  p50: number | null
  p95: number | null
  count: number
}

export interface OverviewWebVitalSeriesDto {
  name: string
  points: OverviewWebVitalTrendPointDto[]
}

export interface GetOverviewResponseDto {
  metrics: OverviewMetricsDto
  trends: {
    errors: OverviewCountTrendPointDto[]
    whiteScreens: OverviewCountTrendPointDto[]
    records: OverviewCountTrendPointDto[]
  }
  webVitals: OverviewWebVitalSeriesDto[]
}
