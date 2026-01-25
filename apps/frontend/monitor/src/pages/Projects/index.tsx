import { useQuery } from '@tanstack/react-query'
import { Package, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { AppSelector, useAppSelector } from '@/components/AppSelector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import * as srv from '@/services'
import { ProjectMetrics } from '@/types/project-overview'

import { CreateProjectsModal } from './CreateProjectModal'

/**
 * 核心指标卡片组件
 */
function MetricCard({ title, value, icon: Icon, trend, trendValue }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; trend?: 'up' | 'down'; trendValue?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && trendValue && (
                    <div className={`flex items-center text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {trendValue}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function Projects() {
    const { selectedAppId, setSelectedAppId, applications, isLoadingApps } = useAppSelector()

    // 获取应用列表（用于refetch）
    const { refetch: refetchApps } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await srv.fetchApplicationList()
            return res.data.applications
        },
        enabled: false,
    })

    // 获取项目总览数据
    const {
        data: overviewData,
        isLoading: isLoadingOverview,
    } = useQuery({
        queryKey: ['project-overview', selectedAppId],
        queryFn: async () => {
            if (!selectedAppId) return null
            const res = await srv.fetchProjectOverview({
                appId: selectedAppId,
                granularity: 'day',
            })
            return res.data
        },
        enabled: !!selectedAppId,
    })

    const createApplication = async (data: Parameters<typeof srv.createApplication>[0]) => {
        try {
            await srv.createApplication(data)
        } catch {
            return false
        }
        refetchApps()
        return true
    }

    // 格式化指标值
    const formatMetric = (metrics: ProjectMetrics | undefined) => {
        if (!metrics) {
            return {
                pv: '-',
                uv: '-',
                errorRate: '-',
                performanceScore: '-',
            }
        }
        return {
            pv: metrics.pv.toLocaleString(),
            uv: metrics.uv.toLocaleString(),
            errorRate: `${metrics.errorRate.toFixed(2)}%`,
            performanceScore: metrics.performanceScore.toFixed(0),
        }
    }

    const formattedMetrics = formatMetric(overviewData?.metrics)

    // 格式化趋势图数据
    const chartData = overviewData?.trends?.map(item => ({
        date: new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        pv: item.pv,
        uv: item.uv,
        errorRate: item.errorRate,
        performanceScore: item.performanceScore,
    })) || []

    // 空状态：没有应用
    if (!isLoadingApps && (!applications || applications.length === 0)) {
        return (
            <div className="flex flex-col h-full">
                <header className="flex items-center justify-between h-[36px] mb-4">
                    <h1 className="flex flex-row items-center text-xl font-semibold">
                        <Package className="h-6 w-6 mr-2" />
                        项目总览
                    </h1>
                </header>
                <div className="flex flex-col h-[calc(100vh-200px)] items-center justify-center space-y-4">
                    <h1 className="text-xl font-semibold">暂无应用</h1>
                    <p className="text-gray-500">当前没有任何应用，请添加新的内容来开始使用。</p>
                    <CreateProjectsModal onCreateProject={createApplication} />
                </div>
            </div>
        )
    }

    // 加载状态
    if (isLoadingApps) {
        return (
            <div className="flex flex-col h-full">
                <header className="flex items-center justify-between h-[36px] mb-4">
                    <h1 className="flex flex-row items-center text-xl font-semibold">
                        <Package className="h-6 w-6 mr-2" />
                        项目总览
                    </h1>
                </header>
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">加载中...</p>
                </div>
            </div>
        )
    }

    // 有应用时的内容
    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between h-[36px] mb-6">
                <h1 className="flex flex-row items-center text-xl font-semibold">
                    <Package className="h-6 w-6 mr-2" />
                    项目总览
                </h1>
                <CreateProjectsModal onCreateProject={createApplication} />
            </header>

            {/* 应用选择器 */}
            <AppSelector selectedAppId={selectedAppId} onAppChange={setSelectedAppId} />

            {/* 核心指标卡片 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <MetricCard title="PV" value={formattedMetrics.pv} icon={TrendingUp} />
                <MetricCard title="UV" value={formattedMetrics.uv} icon={Users} />
                <MetricCard title="错误率" value={formattedMetrics.errorRate} icon={TrendingDown} />
                <MetricCard title="性能评分" value={formattedMetrics.performanceScore} icon={Package} />
            </div>

            {/* 趋势折线图 */}
            <Card>
                <CardHeader>
                    <CardTitle>趋势分析</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingOverview ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-muted-foreground">加载中...</p>
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-muted-foreground">暂无数据</p>
                        </div>
                    ) : (
                        <ChartContainer
                            config={{
                                pv: {
                                    label: 'PV',
                                    color: 'hsl(var(--chart-1))',
                                },
                                uv: {
                                    label: 'UV',
                                    color: 'hsl(var(--chart-2))',
                                },
                                errorRate: {
                                    label: '错误率',
                                    color: 'hsl(var(--chart-3))',
                                },
                                performanceScore: {
                                    label: '性能评分',
                                    color: 'hsl(var(--chart-4))',
                                },
                            }}
                            className="h-[400px] w-full"
                        >
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                    top: 12,
                                    bottom: 12,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={value => value}
                                />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            indicator="line"
                                            labelFormatter={value => `日期: ${value}`}
                                        />
                                    }
                                    cursor={false}
                                />
                                <Line
                                    dataKey="pv"
                                    type="monotone"
                                    stroke="var(--color-pv)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                                <Line
                                    dataKey="uv"
                                    type="monotone"
                                    stroke="var(--color-uv)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                                <Line
                                    dataKey="errorRate"
                                    type="monotone"
                                    stroke="var(--color-errorRate)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                                <Line
                                    dataKey="performanceScore"
                                    type="monotone"
                                    stroke="var(--color-performanceScore)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
