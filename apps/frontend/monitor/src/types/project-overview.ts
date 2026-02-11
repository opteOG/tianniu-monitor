/**
 * 项目总览相关类型定义
 */

/**
 * 时间粒度
 */
export type TimeGranularity = 'hour' | 'day' | 'week' | 'month'

/**
 * 项目总览请求参数
 */
export interface ProjectOverviewParams {
  /** 应用ID */
  appId: string
  /** 时间粒度 */
  granularity: TimeGranularity
  /** 开始时间（可选，ISO 8601格式） */
  startTime?: string
  /** 结束时间（可选，ISO 8601格式） */
  endTime?: string
}

/**
 * 核心指标
 */
export interface ProjectMetrics {
  /** 错误数量（包含 error + vue_error） */
  errorCount: number
  /** 白屏数量 */
  whiteScreenCount: number
  /** 录屏数量 */
  recordCount: number
  /** WebVitals 样本数量 */
  webVitalSampleCount: number
}

/**
 * 计数趋势数据点
 */
export interface CountTrendPoint {
  bucket: string
  count: number
}

export interface ProjectOverviewTrends {
  errors: CountTrendPoint[]
  whiteScreens: CountTrendPoint[]
  records: CountTrendPoint[]
}

export interface WebVitalTrendPoint {
  bucket: string
  p50: number | null
  p95: number | null
  count: number
}

export interface WebVitalSeries {
  name: string
  points: WebVitalTrendPoint[]
}

/**
 * 项目总览响应数据
 */
export interface ProjectOverviewResponse {
  /** 核心指标 */
  metrics: ProjectMetrics
  /** 趋势数据 */
  trends: ProjectOverviewTrends
  /** WebVitals 趋势 */
  webVitals: WebVitalSeries[]
}

/**
 * 项目总览API响应
 */
export interface ProjectOverviewRes {
  data: ProjectOverviewResponse
}
