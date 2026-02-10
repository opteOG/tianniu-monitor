import { z } from 'zod'
// 时间粒度
export type TimeGranularity = 'hour' | 'day' | 'week' | 'month'
// 获取应用总览数据传输对象
export const getOverviewSchema = z.object({
  appId: z.string(),
  granularity: z.enum(['hour', 'day', 'week', 'month']),
})
export type GetOverviewDto = z.infer<typeof getOverviewSchema>
