/**
 * 错误相关类型定义
 */

/**
 * 错误状态
 */
export type ErrorStatus = 'open' | 'closed'

/**
 * 排序方式
 */
export type ErrorSortBy = 'time' | 'status'

/**
 * 排序顺序
 */
export type ErrorSortOrder = 'asc' | 'desc'

/**
 * 错误信息
 */
export interface ErrorInfo {
    /** 错误类型 */
    type: string
    /** 堆栈信息 */
    stack: string
    /** 页面路径 */
    path: string
}

/**
 * 错误数据
 */
export interface ErrorData {
    /** 错误ID */
    id: string
    /** 错误信息 */
    info: ErrorInfo
    /** 错误消息 */
    message: string
    /** 创建时间 */
    created_at: string
    /** 应用ID */
    app_id: string
    /** 状态 */
    status: ErrorStatus
}

/**
 * 错误列表请求参数
 */
export interface ErrorListParams {
    /** 应用ID */
    appId: string
    /** 页码 */
    page: number
    /** 每页数量 */
    pageSize: number
    /** 排序字段 */
    sortBy?: ErrorSortBy
    /** 排序顺序 */
    sortOrder?: ErrorSortOrder
    /** 状态筛选 */
    status?: ErrorStatus
}

/**
 * 错误列表响应数据
 */
export interface ErrorListResponse {
    /** 错误列表 */
    errors: ErrorData[]
    /** 总数 */
    total: number
    /** 当前页 */
    page: number
    /** 每页数量 */
    pageSize: number
    /** 总页数 */
    totalPages: number
}

/**
 * 错误列表API响应
 */
export interface ErrorListRes {
    data: ErrorListResponse
}

/**
 * 更新错误状态请求参数
 */
export interface UpdateErrorStatusParams {
    /** 错误ID */
    errorId: string
    /** 新状态 */
    status: ErrorStatus
}

