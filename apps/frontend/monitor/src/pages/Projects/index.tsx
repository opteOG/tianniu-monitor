import { useQuery } from '@tanstack/react-query'
import { Activity, Bug, Package, TrendingDown, TrendingUp, Users } from 'lucide-react'
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
                errorCount: '-',
                whiteScreenCount: '-',
                recordCount: '-',
                webVitalSampleCount: '-',
            }
        }
        return {
            errorCount: metrics.errorCount.toLocaleString(),
            whiteScreenCount: metrics.whiteScreenCount.toLocaleString(),
            recordCount: metrics.recordCount.toLocaleString(),
            webVitalSampleCount: metrics.webVitalSampleCount.toLocaleString(),
        }
    }

    const formattedMetrics = formatMetric(overviewData?.metrics)

    const formatBucketLabel = (bucket: string) => {
        if (bucket.includes('W')) return bucket
        const dt = new Date(bucket)
        if (!Number.isNaN(dt.getTime())) {
            return dt.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
        }
        return bucket
    }

    const countTrendChartData =
        overviewData?.trends
            ? (() => {
                  const buckets = new Map<
                      string,
                      {
                          bucket: string
                          label: string
                          errors?: number
                          whiteScreens?: number
                          records?: number
                      }
                  >()

                  const upsert = (bucket: string) => {
                      const existing = buckets.get(bucket)
                      if (existing) return existing
                      const created = { bucket, label: formatBucketLabel(bucket) }
                      buckets.set(bucket, created)
                      return created
                  }

                  for (const p of overviewData.trends.errors ?? []) {
                      const item = upsert(p.bucket)
                      ;(item as any).errors = p.count
                  }
                  for (const p of overviewData.trends.whiteScreens ?? []) {
                      const item = upsert(p.bucket)
                      ;(item as any).whiteScreens = p.count
                  }
                  for (const p of overviewData.trends.records ?? []) {
                      const item = upsert(p.bucket)
                      ;(item as any).records = p.count
                  }

                  return [...buckets.values()]
                      .sort((a, b) => (a.bucket < b.bucket ? -1 : a.bucket > b.bucket ? 1 : 0))
                      .map(item => ({
                          label: item.label,
                          errors: item.errors ?? 0,
                          whiteScreens: item.whiteScreens ?? 0,
                          records: item.records ?? 0,
                      }))
              })()
            : []

    const webVitalSeries = overviewData?.webVitals ?? []
    const preferredWebVitalOrder = ['LCP', 'CLS', 'FCP', 'TTFB', 'LOAD']
    const selectedWebVitalSeries = [...webVitalSeries]
        .sort((a, b) => {
            const ia = preferredWebVitalOrder.indexOf(a.name)
            const ib = preferredWebVitalOrder.indexOf(b.name)
            const ra = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
            const rb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
            return ra - rb
        })
        .slice(0, 4)

    const webVitalChartData = (() => {
        const buckets = new Map<string, Record<string, string | number | null>>()

        const upsert = (bucket: string) => {
            const existing = buckets.get(bucket)
            if (existing) return existing
            const created: Record<string, string | number | null> = { bucket, label: formatBucketLabel(bucket) }
            buckets.set(bucket, created)
            return created
        }

        for (const series of selectedWebVitalSeries) {
            for (const point of series.points ?? []) {
                const row = upsert(point.bucket)
                row[series.name] = point.p95 ?? point.p50 ?? null
            }
        }

        return [...buckets.values()]
            .sort((a, b) => {
                const ba = String(a.bucket)
                const bb = String(b.bucket)
                return ba < bb ? -1 : ba > bb ? 1 : 0
            })
            .map(row => {
                const { bucket: _bucket, ...rest } = row
                return rest
            })
    })()

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
                <MetricCard title="错误数" value={formattedMetrics.errorCount} icon={Bug} />
                <MetricCard title="白屏数" value={formattedMetrics.whiteScreenCount} icon={TrendingDown} />
                <MetricCard title="录屏数" value={formattedMetrics.recordCount} icon={Users} />
                <MetricCard title="WebVitals 样本数" value={formattedMetrics.webVitalSampleCount} icon={Activity} />
            </div>

            {/* 趋势折线图 */}
            <Card>
                <CardHeader>
                    <CardTitle>事件趋势</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingOverview ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-muted-foreground">加载中...</p>
                        </div>
                    ) : countTrendChartData.length === 0 ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-muted-foreground">暂无数据</p>
                        </div>
                    ) : (
                        <ChartContainer
                            config={{
                                errors: {
                                    label: '错误',
                                    color: 'hsl(var(--chart-1))',
                                },
                                whiteScreens: {
                                    label: '白屏',
                                    color: 'hsl(var(--chart-2))',
                                },
                                records: {
                                    label: '录屏',
                                    color: 'hsl(var(--chart-3))',
                                },
                            }}
                            className="h-[400px] w-full"
                        >
                            <LineChart
                                accessibilityLayer
                                data={countTrendChartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                    top: 12,
                                    bottom: 12,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                                <XAxis
                                    dataKey="label"
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
                                            labelFormatter={value => `时间: ${value}`}
                                        />
                                    }
                                    cursor={false}
                                />
                                <Line
                                    dataKey="errors"
                                    type="monotone"
                                    stroke="var(--color-errors)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                                <Line
                                    dataKey="whiteScreens"
                                    type="monotone"
                                    stroke="var(--color-whiteScreens)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                                <Line
                                    dataKey="records"
                                    type="monotone"
                                    stroke="var(--color-records)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>WebVitals（P95）</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingOverview ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-muted-foreground">加载中...</p>
                        </div>
                    ) : webVitalChartData.length === 0 || selectedWebVitalSeries.length === 0 ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <p className="text-muted-foreground">暂无数据</p>
                        </div>
                    ) : (
                        <ChartContainer
                            config={Object.fromEntries(
                                selectedWebVitalSeries.map((s, idx) => [
                                    s.name,
                                    {
                                        label: s.name,
                                        color: `hsl(var(--chart-${idx + 1}))`,
                                    },
                                ])
                            )}
                            className="h-[400px] w-full"
                        >
                            <LineChart
                                accessibilityLayer
                                data={webVitalChartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                    top: 12,
                                    bottom: 12,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={value => value} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip
                                    content={<ChartTooltipContent indicator="line" labelFormatter={value => `时间: ${value}`} />}
                                    cursor={false}
                                />
                                {selectedWebVitalSeries.map(series => (
                                    <Line
                                        key={series.name}
                                        dataKey={series.name}
                                        type="monotone"
                                        stroke={`var(--color-${series.name})`}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                ))}
                            </LineChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
