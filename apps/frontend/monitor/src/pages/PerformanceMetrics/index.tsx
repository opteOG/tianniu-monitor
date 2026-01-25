import { useQuery } from '@tanstack/react-query'
import { Activity, Gauge, Layout, Loader, Timer, Zap } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, XAxis, YAxis } from 'recharts'

import { AppSelector, useAppSelector } from '@/components/AppSelector'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import * as srv from '@/services'
import {
    PerformanceRating,
    formatMetricValue,
    getRatingColor,
    getRatingLabel,
} from '@/types/performance-metrics'

/**
 * 核心指标卡片组件
 */
function PerformanceMetricCard({
    title,
    value,
    unit,
    rating,
    icon: Icon,
}: {
    title: string
    value: number | string
    unit: string
    rating: PerformanceRating
    icon: React.ComponentType<{ className?: string }>
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
                </div>
                <div className={`flex items-center text-xs mt-1 ${getRatingColor(rating)}`}>
                    <Badge variant="outline" className={`text-xs ${getRatingColor(rating)} border-current`}>
                        {getRatingLabel(rating)}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}

/**
 * 性能评分仪表盘组件
 */
function PerformanceScoreGauge({ score, rating }: { score: number; rating: PerformanceRating }) {
    const percentage = score
    const color = rating === 'good' ? '#22c55e' : rating === 'needs-improvement' ? '#eab308' : '#ef4444'

    return (
        <Card>
            <CardHeader>
                <CardTitle>性能评分</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center h-[200px]">
                    <div className="relative w-32 h-32">
                        <svg className="transform -rotate-90 w-32 h-32">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke={color}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${(percentage / 100) * 351.86} 351.86`}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-3xl font-bold" style={{ color }}>
                                    {Math.round(score)}
                                </div>
                                <div className="text-xs text-muted-foreground">分</div>
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className={`mt-4 ${getRatingColor(rating)} border-current`}>
                        {getRatingLabel(rating)}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}

export function PerformanceMetrics() {
    const { selectedAppId, setSelectedAppId, isLoadingApps, applications } = useAppSelector()

    // 获取性能指标数据
    const {
        data: performanceData,
        isLoading: isLoadingPerformance,
    } = useQuery({
        queryKey: ['performance-metrics', selectedAppId],
        queryFn: async () => {
            if (!selectedAppId) return null
            const res = await srv.fetchPerformanceMetrics({
                appId: selectedAppId,
                granularity: 'day',
            })
            return res.data
        },
        enabled: !!selectedAppId,
    })

    // 空状态：没有应用
    if (!isLoadingApps && (!applications || applications.length === 0)) {
        return (
            <div className="flex flex-col h-full">
                <header className="flex items-center justify-between h-[36px] mb-4">
                    <h1 className="flex flex-row items-center text-xl font-semibold">
                        <Activity className="h-6 w-6 mr-2" />
                        监控-性能指标
                    </h1>
                </header>
                <div className="flex flex-col h-[calc(100vh-200px)] items-center justify-center space-y-4">
                    <h1 className="text-xl font-semibold">暂无应用</h1>
                    <p className="text-gray-500">当前没有任何应用，请先创建应用。</p>
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
                        <Activity className="h-6 w-6 mr-2" />
                        监控-性能指标
                    </h1>
                </header>
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">加载中...</p>
                </div>
            </div>
        )
    }

    const coreMetrics = performanceData?.coreMetrics
    const trends = performanceData?.trends || []
    const distributions = performanceData?.distributions || []
    const pagePaths = performanceData?.pagePaths || []
    const score = performanceData?.score

    // 格式化趋势图数据
    const chartData = trends.map(item => ({
        date: new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        cls: item.cls,
        fcp: item.fcp,
        lcp: item.lcp,
        ttfb: item.ttfb,
        load: item.load,
    }))

    // 格式化雷达图数据
    const radarData = score
        ? [
              {
                  metric: 'CLS',
                  value: score.metrics.cls,
                  fullMark: 100,
              },
              {
                  metric: 'FCP',
                  value: score.metrics.fcp,
                  fullMark: 100,
              },
              {
                  metric: 'LCP',
                  value: score.metrics.lcp,
                  fullMark: 100,
              },
              {
                  metric: 'TTFB',
                  value: score.metrics.ttfb,
                  fullMark: 100,
              },
              {
                  metric: 'LOAD',
                  value: score.metrics.load,
                  fullMark: 100,
              },
          ]
        : []

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between h-[36px] mb-6">
                <h1 className="flex flex-row items-center text-xl font-semibold">
                    <Activity className="h-6 w-6 mr-2" />
                    监控-性能指标
                </h1>
            </header>

            {/* 应用选择器 */}
            <AppSelector selectedAppId={selectedAppId} onAppChange={setSelectedAppId} />

            {/* 核心指标卡片 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
                {coreMetrics && (
                    <>
                        <PerformanceMetricCard
                            title="CLS"
                            value={formatMetricValue('CLS', coreMetrics.cls.value)}
                            unit=""
                            rating={coreMetrics.cls.rating}
                            icon={Layout}
                        />
                        <PerformanceMetricCard
                            title="FCP"
                            value={formatMetricValue('FCP', coreMetrics.fcp.value)}
                            unit="ms"
                            rating={coreMetrics.fcp.rating}
                            icon={Zap}
                        />
                        <PerformanceMetricCard
                            title="LCP"
                            value={formatMetricValue('LCP', coreMetrics.lcp.value)}
                            unit="ms"
                            rating={coreMetrics.lcp.rating}
                            icon={Timer}
                        />
                        <PerformanceMetricCard
                            title="TTFB"
                            value={formatMetricValue('TTFB', coreMetrics.ttfb.value)}
                            unit="ms"
                            rating={coreMetrics.ttfb.rating}
                            icon={Loader}
                        />
                        <PerformanceMetricCard
                            title="LOAD"
                            value={formatMetricValue('LOAD', coreMetrics.load.value)}
                            unit="ms"
                            rating={coreMetrics.load.rating}
                            icon={Gauge}
                        />
                    </>
                )}
            </div>

            {/* 性能评分和趋势图 */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                {/* 性能评分仪表盘 */}
                {score && (
                    <div className="md:col-span-1">
                        <PerformanceScoreGauge score={score.score} rating={score.rating} />
                    </div>
                )}

                {/* 趋势折线图 */}
                <div className="md:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>趋势分析</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingPerformance ? (
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
                                        cls: {
                                            label: 'CLS',
                                            color: 'hsl(var(--chart-1))',
                                        },
                                        fcp: {
                                            label: 'FCP',
                                            color: 'hsl(var(--chart-2))',
                                        },
                                        lcp: {
                                            label: 'LCP',
                                            color: 'hsl(var(--chart-3))',
                                        },
                                        ttfb: {
                                            label: 'TTFB',
                                            color: 'hsl(var(--chart-4))',
                                        },
                                        load: {
                                            label: 'LOAD',
                                            color: 'hsl(var(--chart-5))',
                                        },
                                    }}
                                    className="h-[400px] w-full"
                                >
                                    <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                        <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} />
                                        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} />
                                        <ChartTooltip
                                            content={<ChartTooltipContent indicator="line" labelFormatter={value => `日期: ${value}`} />}
                                            cursor={false}
                                        />
                                        <Line yAxisId="left" dataKey="fcp" type="monotone" stroke="var(--color-fcp)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                        <Line yAxisId="left" dataKey="lcp" type="monotone" stroke="var(--color-lcp)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                        <Line yAxisId="left" dataKey="ttfb" type="monotone" stroke="var(--color-ttfb)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                        <Line yAxisId="left" dataKey="load" type="monotone" stroke="var(--color-load)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                        <Line yAxisId="right" dataKey="cls" type="monotone" stroke="var(--color-cls)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                    </LineChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 分布直方图 */}
            {distributions.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>分布统计</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {distributions.map(dist => {
                                const data = [
                                    { name: 'P50', value: dist.p50 },
                                    { name: 'P75', value: dist.p75 },
                                    { name: 'P95', value: dist.p95 },
                                    { name: 'P99', value: dist.p99 },
                                ]
                                return (
                                    <div key={dist.metric} className="h-[200px]">
                                        <ChartContainer
                                            config={{
                                                value: {
                                                    label: dist.metric,
                                                    color: 'hsl(var(--chart-1))',
                                                },
                                            }}
                                            className="h-full w-full"
                                        >
                                            <BarChart data={data}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                                <YAxis tickLine={false} axisLine={false} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ChartContainer>
                                        <div className="text-center text-sm text-muted-foreground mt-2">{dist.metric}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 雷达图 */}
            {radarData.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>性能雷达图</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <ChartContainer
                                config={{
                                    value: {
                                        label: '评分',
                                        color: 'hsl(var(--chart-1))',
                                    },
                                }}
                                className="h-full w-full"
                            >
                                <RadarChart data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="metric" />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                    <Radar name="性能评分" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.6} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </RadarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 页面路径热力图 */}
            {pagePaths.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>页面路径性能</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">页面路径</th>
                                        <th className="text-right p-2">访问次数</th>
                                        <th className="text-right p-2">CLS</th>
                                        <th className="text-right p-2">FCP</th>
                                        <th className="text-right p-2">LCP</th>
                                        <th className="text-right p-2">TTFB</th>
                                        <th className="text-right p-2">LOAD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagePaths.map((page, index) => (
                                        <tr key={index} className="border-b hover:bg-muted/50">
                                            <td className="p-2 font-mono text-sm">{page.path}</td>
                                            <td className="text-right p-2">{page.count}</td>
                                            <td className="text-right p-2">
                                                <Badge variant="outline" className={`${getRatingColor(page.clsRating)} border-current`}>
                                                    {formatMetricValue('CLS', page.cls)}
                                                </Badge>
                                            </td>
                                            <td className="text-right p-2">
                                                <Badge variant="outline" className={`${getRatingColor(page.fcpRating)} border-current`}>
                                                    {formatMetricValue('FCP', page.fcp)}
                                                </Badge>
                                            </td>
                                            <td className="text-right p-2">
                                                <Badge variant="outline" className={`${getRatingColor(page.lcpRating)} border-current`}>
                                                    {formatMetricValue('LCP', page.lcp)}
                                                </Badge>
                                            </td>
                                            <td className="text-right p-2">
                                                <Badge variant="outline" className={`${getRatingColor(page.ttfbRating)} border-current`}>
                                                    {formatMetricValue('TTFB', page.ttfb)}
                                                </Badge>
                                            </td>
                                            <td className="text-right p-2">
                                                <Badge variant="outline" className={`${getRatingColor(page.loadRating)} border-current`}>
                                                    {formatMetricValue('LOAD', page.load)}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

