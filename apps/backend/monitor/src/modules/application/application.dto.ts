import { z } from 'zod'

/**
 * 创建应用的数据传输对象
 */
export const createApplicationSchema = z
    .object({
        type: z.enum(['vanilla', 'react', 'vue']),
        name: z.string(),
    })
    .required()

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>

/**
 * 删除应用的数据传输对象
 */
export const deleteApplicationSchema = z
    .object({
        appId: z.string(),
    })
    .required()

export type DeleteApplicationDto = z.infer<typeof deleteApplicationSchema>

// 时间粒度
export type TimeGranularity = 'hour' | 'day' | 'week' | 'month'
// 获取应用总览数据传输对象
export const getOverviewSchema = z.object({
    appId: z.string(),
    granularity: z.enum(['hour', 'day', 'week', 'month']),
})
export type GetOverviewDto = z.infer<typeof getOverviewSchema>