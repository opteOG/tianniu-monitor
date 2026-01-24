/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    LabelList,
    Line,
    LineChart,
    PolarAngleAxis,
    RadialBar,
    RadialBarChart,
    Rectangle,
    ReferenceLine,
    XAxis,
    YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'

export function Dashboard() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="grid w-full gap-6 sm:grid-cols-2  lg:grid-cols-1">
                <Card x-chunk="charts-01-chunk-0">
                    <CardHeader className="space-y-0 pb-2">
                        <CardDescription>今日 API 请求总量</CardDescription>
                        <CardTitle className="text-4xl tabular-nums">
                            12,584 <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">次</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                requests: {
                                    label: 'Requests',
                                    color: 'hsl(var(--chart-1))',
                                },
                            }}
                        >
                            <BarChart
                                accessibilityLayer
                                margin={{
                                    left: -4,
                                    right: -4,
                                }}
                                data={[
                                    {
                                        date: '2024-01-01',
                                        requests: 2000,
                                    },
                                    {
                                        date: '2024-01-02',
                                        requests: 2100,
                                    },
                                    {
                                        date: '2024-01-03',
                                        requests: 2200,
                                    },
                                    {
                                        date: '2024-01-04',
                                        requests: 1300,
                                    },
                                    {
                                        date: '2024-01-05',
                                        requests: 1400,
                                    },
                                    {
                                        date: '2024-01-06',
                                        requests: 2500,
                                    },
                                    {
                                        date: '2024-01-07',
                                        requests: 1600,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="requests"
                                    fill="var(--color-requests)"
                                    radius={5}
                                    fillOpacity={0.6}
                                    activeBar={<Rectangle fillOpacity={0.8} />}
                                />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={4}
                                    tickFormatter={value => {
                                        return new Date(value).toLocaleDateString('zh-CN', {
                                            weekday: 'short',
                                        })
                                    }}
                                />
                                <ChartTooltip
                                    defaultIndex={2}
                                    content={
                                        <ChartTooltipContent
                                            hideIndicator
                                            labelFormatter={value => {
                                                return new Date(value).toLocaleDateString('zh-CN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                            }}
                                        />
                                    }
                                    cursor={false}
                                />
                                <ReferenceLine y={1200} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeWidth={1}>
                                    <Label position="insideBottomLeft" value="Average Requests" offset={10} fill="hsl(var(--foreground))" />
                                    <Label
                                        position="insideTopLeft"
                                        value="12,343"
                                        className="text-lg"
                                        fill="hsl(var(--foreground))"
                                        offset={10}
                                        startOffset={100}
                                    />
                                </ReferenceLine>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1">
                        <CardDescription>
                            最近7天，API 请求总量达到 <span className="font-medium text-foreground">53,305</span> 次。
                        </CardDescription>
                        <CardDescription>
                            预计今日将达到 <span className="font-medium text-foreground">12,584</span> 次。
                        </CardDescription>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col" x-chunk="charts-01-chunk-1">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                        <div>
                            <CardDescription>平均响应时间</CardDescription>
                            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                                62
                                <span className="text-sm font-normal tracking-normal text-muted-foreground">ms</span>
                            </CardTitle>
                        </div>
                        <div>
                            <CardDescription>错误率</CardDescription>
                            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                                0.35
                                <span className="text-sm font-normal tracking-normal text-muted-foreground">%</span>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center">
                        <ChartContainer
                            config={{
                                responseTime: {
                                    label: 'Response Time',
                                    color: 'hsl(var(--chart-1))',
                                },
                            }}
                            className="w-full"
                        >
                            <LineChart
                                accessibilityLayer
                                margin={{
                                    left: 14,
                                    right: 14,
                                    top: 10,
                                }}
                                data={[
                                    {
                                        date: '2024-01-01',
                                        responseTime: 62,
                                    },
                                    {
                                        date: '2024-01-02',
                                        responseTime: 72,
                                    },
                                    {
                                        date: '2024-01-03',
                                        responseTime: 35,
                                    },
                                    {
                                        date: '2024-01-04',
                                        responseTime: 62,
                                    },
                                    {
                                        date: '2024-01-05',
                                        responseTime: 52,
                                    },
                                    {
                                        date: '2024-01-06',
                                        responseTime: 62,
                                    },
                                    {
                                        date: '2024-01-07',
                                        responseTime: 70,
                                    },
                                ]}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeOpacity={0.5}
                                />
                                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={value => {
                                        return new Date(value).toLocaleDateString('zh-CN', {
                                            weekday: 'short',
                                        })
                                    }}
                                />
                                <Line
                                    dataKey="responseTime"
                                    type="natural"
                                    fill="var(--color-responseTime)"
                                    stroke="var(--color-responseTime)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        fill: 'var(--color-responseTime)',
                                        stroke: 'var(--color-responseTime)',
                                        r: 4,
                                    }}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            indicator="line"
                                            labelFormatter={value => {
                                                return new Date(value).toLocaleDateString('zh-CN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                            }}
                                        />
                                    }
                                    cursor={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="grid w-full flex-1 gap-6">
                <Card x-chunk="charts-01-chunk-2">
                    <CardHeader>
                        <CardTitle>系统负载</CardTitle>
                        <CardDescription>本周系统平均负载低于上周。</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid auto-rows-min gap-2">
                            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                45
                                <span className="text-sm font-normal text-muted-foreground">%</span>
                            </div>
                            <ChartContainer
                                config={{
                                    load: {
                                        label: 'Load',
                                        color: 'hsl(var(--chart-1))',
                                    },
                                }}
                                className="aspect-auto h-[32px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    layout="vertical"
                                    margin={{
                                        left: 0,
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                    data={[
                                        {
                                            date: '2024',
                                            load: 45,
                                        },
                                    ]}
                                >
                                    <Bar dataKey="load" fill="var(--color-load)" radius={4} barSize={32}>
                                        <LabelList position="insideLeft" dataKey="date" offset={8} fontSize={12} fill="white" />
                                    </Bar>
                                    <YAxis dataKey="date" type="category" tickCount={1} hide />
                                    <XAxis dataKey="load" type="number" hide />
                                </BarChart>
                            </ChartContainer>
                        </div>
                        <div className="grid auto-rows-min gap-2">
                            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                60
                                <span className="text-sm font-normal text-muted-foreground">%</span>
                            </div>
                            <ChartContainer
                                config={{
                                    load: {
                                        label: 'Load',
                                        color: 'hsl(var(--muted))',
                                    },
                                }}
                                className="aspect-auto h-[32px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    layout="vertical"
                                    margin={{
                                        left: 0,
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                    data={[
                                        {
                                            date: '2023',
                                            load: 60,
                                        },
                                    ]}
                                >
                                    <Bar dataKey="load" fill="var(--color-load)" radius={4} barSize={32}>
                                        <LabelList
                                            position="insideLeft"
                                            dataKey="date"
                                            offset={8}
                                            fontSize={12}
                                            fill="hsl(var(--muted-foreground))"
                                        />
                                    </Bar>
                                    <YAxis dataKey="date" type="category" tickCount={1} hide />
                                    <XAxis dataKey="load" type="number" hide />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card x-chunk="charts-01-chunk-3">
                    <CardHeader className="p-4 pb-0">
                        <CardTitle>网络吞吐量</CardTitle>
                        <CardDescription>过去7天平均吞吐量为 12.5 MB/s。</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                            12.5
                            <span className="text-sm font-normal text-muted-foreground">MB/s</span>
                        </div>
                        <ChartContainer
                            config={{
                                throughput: {
                                    label: 'Throughput',
                                    color: 'hsl(var(--chart-1))',
                                },
                            }}
                            className="ml-auto w-[72px]"
                        >
                            <BarChart
                                accessibilityLayer
                                margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: '2024-01-01',
                                        throughput: 10,
                                    },
                                    {
                                        date: '2024-01-02',
                                        throughput: 12,
                                    },
                                    {
                                        date: '2024-01-03',
                                        throughput: 15,
                                    },
                                    {
                                        date: '2024-01-04',
                                        throughput: 11,
                                    },
                                    {
                                        date: '2024-01-05',
                                        throughput: 13,
                                    },
                                    {
                                        date: '2024-01-06',
                                        throughput: 14,
                                    },
                                    {
                                        date: '2024-01-07',
                                        throughput: 12,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="throughput"
                                    fill="var(--color-throughput)"
                                    radius={2}
                                    fillOpacity={0.2}
                                    activeIndex={6}
                                    activeBar={<Rectangle fillOpacity={0.8} />}
                                />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} hide />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card x-chunk="charts-01-chunk-4">
                    <CardContent className="flex gap-4 p-4 pb-2">
                        <ChartContainer
                            config={{
                                cpu: {
                                    label: 'CPU',
                                    color: 'hsl(var(--chart-1))',
                                },
                                memory: {
                                    label: 'Memory',
                                    color: 'hsl(var(--chart-2))',
                                },
                                disk: {
                                    label: 'Disk',
                                    color: 'hsl(var(--chart-3))',
                                },
                            }}
                            className="h-[140px] w-full"
                        >
                            <BarChart
                                margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 10,
                                }}
                                data={[
                                    {
                                        activity: 'disk',
                                        value: 75,
                                        label: '75%',
                                        fill: 'var(--color-disk)',
                                    },
                                    {
                                        activity: 'memory',
                                        value: 60,
                                        label: '60%',
                                        fill: 'var(--color-memory)',
                                    },
                                    {
                                        activity: 'cpu',
                                        value: 45,
                                        label: '45%',
                                        fill: 'var(--color-cpu)',
                                    },
                                ]}
                                layout="vertical"
                                barSize={32}
                                barGap={2}
                            >
                                <XAxis type="number" dataKey="value" hide />
                                <YAxis
                                    dataKey="activity"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={4}
                                    axisLine={false}
                                    className="capitalize"
                                />
                                <Bar dataKey="value" radius={5}>
                                    <LabelList position="insideLeft" dataKey="label" fill="white" offset={8} fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex flex-row border-t p-4">
                        <div className="flex w-full items-center gap-2">
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-xs text-muted-foreground">CPU</div>
                                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                    45
                                    <span className="text-sm font-normal text-muted-foreground">%</span>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-xs text-muted-foreground">Memory</div>
                                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                    60
                                    <span className="text-sm font-normal text-muted-foreground">%</span>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-xs text-muted-foreground">Disk</div>
                                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                    75
                                    <span className="text-sm font-normal text-muted-foreground">%</span>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="grid w-full flex-1 gap-6">
                <Card x-chunk="charts-01-chunk-5">
                    <CardContent className="flex gap-4 p-4">
                        <div className="grid items-center gap-2">
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-sm text-muted-foreground">API Server</div>
                                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                    99
                                    <span className="text-sm font-normal text-muted-foreground">%</span>
                                </div>
                            </div>
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-sm text-muted-foreground">Database</div>
                                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                    98
                                    <span className="text-sm font-normal text-muted-foreground">%</span>
                                </div>
                            </div>
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-sm text-muted-foreground">Cache</div>
                                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                    95
                                    <span className="text-sm font-normal text-muted-foreground">%</span>
                                </div>
                            </div>
                        </div>
                        <ChartContainer
                            config={{
                                api: {
                                    label: 'API Server',
                                    color: 'hsl(var(--chart-1))',
                                },
                                db: {
                                    label: 'Database',
                                    color: 'hsl(var(--chart-2))',
                                },
                                cache: {
                                    label: 'Cache',
                                    color: 'hsl(var(--chart-3))',
                                },
                            }}
                            className="mx-auto aspect-square w-full max-w-[80%]"
                        >
                            <RadialBarChart
                                margin={{
                                    left: -10,
                                    right: -10,
                                    top: -10,
                                    bottom: -10,
                                }}
                                data={[
                                    {
                                        activity: 'cache',
                                        value: 95,
                                        fill: 'var(--color-cache)',
                                    },
                                    {
                                        activity: 'db',
                                        value: 98,
                                        fill: 'var(--color-db)',
                                    },
                                    {
                                        activity: 'api',
                                        value: 99,
                                        fill: 'var(--color-api)',
                                    },
                                ]}
                                innerRadius="20%"
                                barSize={24}
                                startAngle={90}
                                endAngle={450}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" tick={false} />
                                <RadialBar dataKey="value" background cornerRadius={5} />
                            </RadialBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card x-chunk="charts-01-chunk-6">
                    <CardHeader className="p-4 pb-0">
                        <CardTitle>异常日志</CardTitle>
                        <CardDescription>今日产生异常日志 1,254 条。</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
                        <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
                            1,254
                            <span className="text-sm font-normal text-muted-foreground">条</span>
                        </div>
                        <ChartContainer
                            config={{
                                errors: {
                                    label: 'Errors',
                                    color: 'hsl(var(--chart-1))',
                                },
                            }}
                            className="ml-auto w-[64px]"
                        >
                            <BarChart
                                accessibilityLayer
                                margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: '2024-01-01',
                                        errors: 354,
                                    },
                                    {
                                        date: '2024-01-02',
                                        errors: 514,
                                    },
                                    {
                                        date: '2024-01-03',
                                        errors: 345,
                                    },
                                    {
                                        date: '2024-01-04',
                                        errors: 734,
                                    },
                                    {
                                        date: '2024-01-05',
                                        errors: 645,
                                    },
                                    {
                                        date: '2024-01-06',
                                        errors: 456,
                                    },
                                    {
                                        date: '2024-01-07',
                                        errors: 345,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="errors"
                                    fill="var(--color-errors)"
                                    radius={2}
                                    fillOpacity={0.2}
                                    activeIndex={6}
                                    activeBar={<Rectangle fillOpacity={0.8} />}
                                />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} hide />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card x-chunk="charts-01-chunk-7">
                    <CardHeader className="space-y-0 pb-0">
                        <CardDescription>平均在线用户</CardDescription>
                        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                            8<span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">k</span>
                            350
                            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">人</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ChartContainer
                            config={{
                                users: {
                                    label: 'Users',
                                    color: 'hsl(var(--chart-2))',
                                },
                            }}
                        >
                            <AreaChart
                                accessibilityLayer
                                data={[
                                    {
                                        date: '2024-01-01',
                                        users: 8.5,
                                    },
                                    {
                                        date: '2024-01-02',
                                        users: 7.2,
                                    },
                                    {
                                        date: '2024-01-03',
                                        users: 8.1,
                                    },
                                    {
                                        date: '2024-01-04',
                                        users: 6.2,
                                    },
                                    {
                                        date: '2024-01-05',
                                        users: 5.2,
                                    },
                                    {
                                        date: '2024-01-06',
                                        users: 8.1,
                                    },
                                    {
                                        date: '2024-01-07',
                                        users: 7.0,
                                    },
                                ]}
                                margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                }}
                            >
                                <XAxis dataKey="date" hide />
                                <YAxis domain={['dataMin - 5', 'dataMax + 2']} hide />
                                <defs>
                                    <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <Area dataKey="users" type="natural" fill="url(#fillUsers)" fillOpacity={0.4} stroke="var(--color-users)" />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                    formatter={value => (
                                        <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                                            Online Users
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                {value}
                                                <span className="font-normal text-muted-foreground">k</span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
