import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Bug, ChevronLeft, ChevronRight, Code, ExternalLink, Filter, X } from 'lucide-react'
import { useState } from 'react'

import { AppSelector, useAppSelector } from '@/components/AppSelector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as srv from '@/services'
import { ErrorData, ErrorSortBy, ErrorSortOrder, ErrorStatus } from '@/types/errors'

/**
 * 堆栈展示对话框
 */
function StackDialog({ error, open, onOpenChange }: { error: ErrorData | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    if (!error) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>错误堆栈信息</DialogTitle>
                    <DialogDescription>{error.message}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <div className="text-sm font-medium mb-2">错误类型</div>
                        <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">{error.info.type}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium mb-2">页面路径</div>
                        <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">{error.info.path}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium mb-2">堆栈信息</div>
                        <pre className="text-xs text-muted-foreground font-mono bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap">
                            {error.info.stack || '无堆栈信息'}
                        </pre>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

/**
 * 定位源码按钮
 */
function SourceLocationButton({ error }: { error: ErrorData }) {
    const handleLocateSource = () => {
        // 从堆栈信息中提取文件路径和行号
        const stackLines = error.info.stack.split('\n')
        const firstStackLine = stackLines.find(line => line.includes('at ') && (line.includes('.js:') || line.includes('.ts:')))
        
        if (firstStackLine) {
            // 提取文件路径和行号
            const match = firstStackLine.match(/(.+):(\d+):(\d+)/)
            if (match) {
                const [, filePath, line, column] = match
                // 这里可以根据实际情况打开源码编辑器或跳转到对应位置
                // 例如：window.open(`vscode://file${filePath}:${line}:${column}`)
                console.log('定位源码:', { filePath, line, column })
                // 可以复制到剪贴板或打开编辑器
                navigator.clipboard.writeText(`${filePath}:${line}:${column}`).then(() => {
                    alert(`已复制源码位置: ${filePath}:${line}:${column}`)
                })
            }
        } else {
            alert('无法从堆栈信息中提取源码位置')
        }
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleLocateSource} className="h-8">
            <Code className="h-4 w-4 mr-1" />
            定位源码
        </Button>
    )
}

export function Errors() {
    const { selectedAppId, setSelectedAppId } = useAppSelector()
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState<ErrorSortBy>('time')
    const [sortOrder, setSortOrder] = useState<ErrorSortOrder>('desc')
    const [selectedError, setSelectedError] = useState<ErrorData | null>(null)
    const [stackDialogOpen, setStackDialogOpen] = useState(false)
    const queryClient = useQueryClient()

    const pageSize = 10

    // 获取错误列表
    const {
        data: errorListData,
        isLoading,
    } = useQuery({
        queryKey: ['errors', selectedAppId, page, sortBy, sortOrder],
        queryFn: async () => {
            if (!selectedAppId) return null
            const res = await srv.fetchErrorList({
                appId: selectedAppId,
                page,
                pageSize,
                sortBy,
                sortOrder,
            })
            return res.data
        },
        enabled: !!selectedAppId,
    })

    // 更新错误状态
    const updateStatusMutation = useMutation({
        mutationFn: srv.updateErrorStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['errors', selectedAppId] })
        },
    })

    const handleToggleStatus = (errorId: string, currentStatus: ErrorStatus) => {
        const newStatus: ErrorStatus = currentStatus === 'open' ? 'closed' : 'open'
        updateStatusMutation.mutate({
            errorId,
            status: newStatus,
        })
    }

    const handleSortChange = (newSortBy: ErrorSortBy) => {
        if (sortBy === newSortBy) {
            // 如果点击同一个排序字段，切换排序顺序
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            // 如果点击不同的排序字段，设置为降序
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
    }

    const errors = errorListData?.errors || []
    const totalPages = errorListData?.totalPages || 0

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between h-[36px] mb-6">
                <h1 className="flex flex-row items-center text-xl font-semibold">
                    <Bug className="h-6 w-6 mr-2" />
                    监控-错误
                </h1>
            </header>

            {/* 应用选择器 */}
            <AppSelector selectedAppId={selectedAppId} onAppChange={setSelectedAppId} />

            {/* 排序和筛选 */}
            {selectedAppId && (
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    排序: {sortBy === 'time' ? '时间' : '状态'} ({sortOrder === 'asc' ? '升序' : '降序'})
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleSortChange('time')}>
                                    按时间排序
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange('status')}>
                                    按状态排序
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {errorListData && (
                        <div className="text-sm text-muted-foreground">
                            共 {errorListData.total} 条错误
                        </div>
                    )}
                </div>
            )}

            {/* 错误列表 */}
            {!selectedAppId ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground">请先选择应用</p>
                    </div>
                </div>
            ) : isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">加载中...</p>
                </div>
            ) : errors.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground">暂无错误数据</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">路径</TableHead>
                                    <TableHead>错误信息</TableHead>
                                    <TableHead className="w-[150px]">时间</TableHead>
                                    <TableHead className="w-[100px]">状态</TableHead>
                                    <TableHead className="w-[200px]">操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {errors.map(error => (
                                    <TableRow key={error.id}>
                                        <TableCell>
                                            <div className="font-mono text-sm">{error.info.path}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-md">
                                                <div className="font-medium mb-1">{error.info.type}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-2">{error.message}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(error.created_at), 'yyyy-MM-dd HH:mm:ss')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={error.status === 'open' ? 'destructive' : 'secondary'}>
                                                {error.status === 'open' ? '开启' : '关闭'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedError(error)
                                                        setStackDialogOpen(true)
                                                    }}
                                                    className="h-8"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                    查看堆栈
                                                </Button>
                                                <SourceLocationButton error={error} />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(error.id, error.status)}
                                                    disabled={updateStatusMutation.isPending}
                                                    className="h-8"
                                                >
                                                    {error.status === 'open' ? (
                                                        <>
                                                            <X className="h-4 w-4 mr-1" />
                                                            关闭
                                                        </>
                                                    ) : (
                                                        '开启'
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* 分页 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                第 {page} / {totalPages} 页
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    上一页
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    下一页
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* 堆栈展示对话框 */}
            {selectedError && (
                <StackDialog error={selectedError} open={stackDialogOpen} onOpenChange={setStackDialogOpen} />
            )}
        </div>
    )
}
