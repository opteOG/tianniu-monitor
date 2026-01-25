/**
 * 性能指标相关类型定义
 */

/**
 * Web Vitals 指标类型
 */
export type WebVitalMetricType = 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'LOAD'

/**
 * 性能指标评级
 */
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor'

/**
 * 时间粒度
 */
export type TimeGranularity = 'hour' | 'day' | 'week' | 'month'

/**
 * 性能指标请求参数
 */
export interface PerformanceMetricsParams {
    /** 应用ID */
    appId: string
    /** 时间粒度 */
    granularity: TimeGranularity
    /** 开始时间（可选，ISO 8601格式） */
    startTime?: string
    /** 结束时间（可选，ISO 8601格式） */
    endTime?: string
    /** 页面路径（可选，用于筛选特定页面） */
    path?: string
}

/**
 * 单个性能指标数据
 */
export interface PerformanceMetricData {
    /** 指标名称 */
    name: WebVitalMetricType
    /** 指标值 */
    value: number
    /** 评级 */
    rating: PerformanceRating
    /** 单位 */
    unit: 'ms' | 'score'
}

/**
 * 核心性能指标（当前值）
 */
export interface CorePerformanceMetrics {
    /** CLS - 累积布局偏移 */
    cls: PerformanceMetricData
    /** FCP - 首次内容绘制 */
    fcp: PerformanceMetricData
    /** LCP - 最大内容绘制 */
    lcp: PerformanceMetricData
    /** TTFB - 首字节时间 */
    ttfb: PerformanceMetricData
    /** LOAD - 页面加载时长 */
    load: PerformanceMetricData
}

/**
 * 性能指标趋势数据点
 */
export interface PerformanceTrendDataPoint {
    /** 日期（ISO 8601格式） */
    date: string
    /** CLS值 */
    cls: number
    /** FCP值（毫秒） */
    fcp: number
    /** LCP值（毫秒） */
    lcp: number
    /** TTFB值（毫秒） */
    ttfb: number
    /** LOAD值（毫秒） */
    load: number
}

/**
 * 性能指标分布统计
 */
export interface PerformanceDistribution {
    /** 指标名称 */
    metric: WebVitalMetricType
    /** P50分位数 */
    p50: number
    /** P75分位数 */
    p75: number
    /** P95分位数 */
    p95: number
    /** P99分位数 */
    p99: number
    /** 最小值 */
    min: number
    /** 最大值 */
    max: number
    /** 平均值 */
    avg: number
    /** 样本数量 */
    count: number
}

/**
 * 页面路径性能数据
 */
export interface PagePathPerformance {
    /** 页面路径 */
    path: string
    /** 访问次数 */
    count: number
    /** CLS值 */
    cls: number
    /** FCP值（毫秒） */
    fcp: number
    /** LCP值（毫秒） */
    lcp: number
    /** TTFB值（毫秒） */
    ttfb: number
    /** LOAD值（毫秒） */
    load: number
    /** CLS评级 */
    clsRating: PerformanceRating
    /** FCP评级 */
    fcpRating: PerformanceRating
    /** LCP评级 */
    lcpRating: PerformanceRating
    /** TTFB评级 */
    ttfbRating: PerformanceRating
    /** LOAD评级 */
    loadRating: PerformanceRating
}

/**
 * 性能评分（综合评分）
 */
export interface PerformanceScore {
    /** 综合评分（0-100） */
    score: number
    /** 评级 */
    rating: PerformanceRating
    /** 各项指标评分 */
    metrics: {
        cls: number
        fcp: number
        lcp: number
        ttfb: number
        load: number
    }
}

/**
 * 性能指标响应数据
 */
export interface PerformanceMetricsResponse {
    /** 核心指标（当前值） */
    coreMetrics: CorePerformanceMetrics
    /** 趋势数据 */
    trends: PerformanceTrendDataPoint[]
    /** 分布统计 */
    distributions: PerformanceDistribution[]
    /** 页面路径性能数据 */
    pagePaths: PagePathPerformance[]
    /** 性能评分 */
    score: PerformanceScore
}

/**
 * 性能指标API响应
 */
export interface PerformanceMetricsRes {
    data: PerformanceMetricsResponse
}

/**
 * Web Vitals 阈值定义
 */
export const WEB_VITALS_THRESHOLDS: Record<WebVitalMetricType, { good: number; needsImprovement: number }> = {
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    TTFB: { good: 800, needsImprovement: 1800 },
    LOAD: { good: 3000, needsImprovement: 5000 },
}

/**
 * 根据指标值计算评级
 */
export function calculateRating(metric: WebVitalMetricType, value: number): PerformanceRating {
    const thresholds = WEB_VITALS_THRESHOLDS[metric]
    if (value <= thresholds.good) {
        return 'good'
    }
    if (value <= thresholds.needsImprovement) {
        return 'needs-improvement'
    }
    return 'poor'
}

/**
 * 根据指标值计算评分（0-100）
 */
export function calculateScore(metric: WebVitalMetricType, value: number): number {
    const thresholds = WEB_VITALS_THRESHOLDS[metric]
    if (value <= thresholds.good) {
        return 100
    }
    if (value <= thresholds.needsImprovement) {
        // 在 good 和 needsImprovement 之间线性插值
        const ratio = (thresholds.needsImprovement - value) / (thresholds.needsImprovement - thresholds.good)
        return 50 + ratio * 50
    }
    // 超过 needsImprovement，线性递减到0
    const maxValue = thresholds.needsImprovement * 2 // 假设超过2倍为0分
    if (value >= maxValue) {
        return 0
    }
    const ratio = (maxValue - value) / (maxValue - thresholds.needsImprovement)
    return ratio * 50
}

/**
 * 格式化指标值显示
 */
export function formatMetricValue(metric: WebVitalMetricType, value: number): string {
    if (metric === 'CLS') {
        return value.toFixed(3)
    }
    return `${Math.round(value)}`
}

/**
 * 获取评级颜色类名
 */
export function getRatingColor(rating: PerformanceRating): string {
    switch (rating) {
        case 'good':
            return 'text-green-600'
        case 'needs-improvement':
            return 'text-yellow-600'
        case 'poor':
            return 'text-red-600'
        default:
            return 'text-gray-600'
    }
}

/**
 * 获取评级中文标签
 */
export function getRatingLabel(rating: PerformanceRating): string {
    switch (rating) {
        case 'good':
            return '良好'
        case 'needs-improvement':
            return '需改进'
        case 'poor':
            return '差'
        default:
            return '-'
    }
}

