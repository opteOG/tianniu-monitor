import { PerformanceMetricsParams, PerformanceMetricsRes } from '@/types/performance-metrics'
import { request } from '@/utils/request'

/**
 * 获取性能指标数据
 * @param params 性能指标请求参数
 * @returns
 */
export const fetchPerformanceMetrics = async (params: PerformanceMetricsParams): Promise<PerformanceMetricsRes> => {
    return await request.get('/dsn-api/performance', { params })
}

