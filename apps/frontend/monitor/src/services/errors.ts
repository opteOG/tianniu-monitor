import { ErrorListParams, ErrorListRes, UpdateErrorStatusParams } from '@/types/errors'
import { request } from '@/utils/request'

/**
 * 获取错误列表
 * @param params 错误列表请求参数
 * @returns
 */
export const fetchErrorList = async (params: ErrorListParams): Promise<ErrorListRes> => {
    return await request.get('/application/errors', { params })
}

/**
 * 更新错误状态
 * @param params 更新错误状态请求参数
 * @returns
 */
export const updateErrorStatus = async (params: UpdateErrorStatusParams) => {
    return await request.patch('/application/errors/status', params)
}

