/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { useQuery } from '@tanstack/react-query'
import { Bug, CalendarCheck, Lightbulb, Package, Settings, Siren, Zap } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Issue, IssueRes } from '@/pages/Issues'
import * as srv from '@/services'
import { miaoConfetti } from '@/utils/miao-confetti'
import { queryClient } from '@/utils/query-client'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function Aside() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const { data: currentUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const res = await srv.currentUser()
            return res.data
        },
    })

    const { data: issues } = useQuery({
        queryKey: ['issues'],
        queryFn: async () => {
            const res = await fetch('/dsn-api/bugs')
            const issues = await res.json()
            const parsedIssues = issues.map((issue: IssueRes, index: number) => ({
                id: index + 1,
                title: issue.info.type,
                description: issue.message,
                status: 'active',
                createdAt: new Date(issue.created_at),
                appId: issue.app_id,
                events: Math.ceil(Math.random() * 20),
                users: Math.ceil(Math.random() * 10),
            }))
            return parsedIssues as Issue[]

            // return MOCK_ISSUES
        },
    })

    const menus = [
        {
            name: 'projects',
            icon: Package,
            title: '项目总览',
            gap: true,
        },
        {
            name: 'issues',
            icon: Bug,
            title: '缺陷',
            badge: issues?.length || 0,
        },
        {
            name: 'performance',
            icon: Zap,
            title: '性能',
            gap: true,
        },
        {
            name: 'dashboard',
            icon: Lightbulb,
            title: '监控',
        },
        {
            name: 'crons',
            icon: CalendarCheck,
            title: '定时任务',
        },
        {
            name: 'alerts',
            icon: Siren,
            title: '告警',
        },
    ]

    const handleConfetti = () => {
        miaoConfetti.firework()
    }
    const handleLogout = () => {
        toast({
            title: '退出登录',
        })
        localStorage.removeItem('token')
        queryClient.clear()
        navigate(`/account/login?redirect=${window.location.pathname}`)
    }
    return (
        <div className=" border-r bg-gray-50 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <a href="/" className="flex items-center gap-2 ">
                        <img className="w-10" src="/logo.png" />
                        <p className="font-semibold text-lg">妙码学院监控平台</p>
                    </a>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {menus.map(menu => (
                            <>
                                <NavLink
                                    key={menu.name}
                                    to={`/${menu.name}`}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                            isActive && 'bg-muted'
                                        )
                                    }
                                >
                                    <menu.icon className="h-4 w-4" />
                                    {menu.title}
                                    {menu.badge && (
                                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                            {menu.badge}
                                        </Badge>
                                    )}
                                </NavLink>
                                {menu.gap && <div className="my-3 h-[1px] bg-gray-100" />}
                            </>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <div className="grid">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-fit flex justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            onClick={handleConfetti}
                        >
                            {currentUser && (
                                <>
                                    <Avatar>
                                        <AvatarImage src={`https://robohash.org/${currentUser.username}?set=set1&size=100x100`} />
                                        <AvatarFallback>{currentUser.username}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-left">
                                        <p className="text-lg">{currentUser.username}！</p>
                                        庆祝一下 🎉
                                    </p>
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full flex justify-start gap-3 mt-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Settings className="h-4 w-4" />
                            设置
                        </Button>
                        <Button variant="outline" size="sm" className="w-full mt-1" onClick={handleLogout}>
                            退出登录
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
