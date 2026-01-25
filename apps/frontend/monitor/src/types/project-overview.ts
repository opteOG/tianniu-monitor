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
    /** 页面浏览量 */
    pv: number
    /** 独立访客数 */
    uv: number
    /** 错误率（百分比，0-100） */
    errorRate: number
    /** 性能评分（0-100） */
    performanceScore: number
}

/**
 * 趋势数据点
 */
export interface TrendDataPoint {
    /** 日期（ISO 8601格式） */
    date: string
    /** 页面浏览量 */
    pv: number
    /** 独立访客数 */
    uv: number
    /** 错误率（百分比，0-100） */
    errorRate: number
    /** 性能评分（0-100） */
    performanceScore: number
}

/**
 * 项目总览响应数据
 */
export interface ProjectOverviewResponse {
    /** 核心指标 */
    metrics: ProjectMetrics
    /** 趋势数据 */
    trends: TrendDataPoint[]
}

/**
 * 项目总览API响应
 */
export interface ProjectOverviewRes {
    data: ProjectOverviewResponse
}

