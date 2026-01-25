import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import * as srv from '@/services'

import { appLogoMap } from '@/pages/Projects/meta'

interface AppSelectorProps {
    /** 当前选中的应用ID */
    selectedAppId: string
    /** 应用选择变化回调 */
    onAppChange: (appId: string) => void
    /** 是否自动选择第一个应用 */
    autoSelectFirst?: boolean
}

/**
 * 应用选择器组件
 */
export function AppSelector({ selectedAppId, onAppChange, autoSelectFirst = true }: AppSelectorProps) {
    // 获取应用列表
    const {
        data: applications,
        isLoading: isLoadingApps,
    } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await srv.fetchApplicationList()
            return res.data.applications
        },
    })

    // 当应用列表加载完成且没有选中应用时，自动选中第一个应用
    useEffect(() => {
        if (autoSelectFirst && applications && applications.length > 0 && !selectedAppId) {
            onAppChange(applications[0]!.appId)
        }
    }, [applications, selectedAppId, autoSelectFirst, onAppChange])

    // 如果没有应用，返回空
    if (!isLoadingApps && (!applications || applications.length === 0)) {
        return null
    }

    return (
        <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">选择应用</Label>
            {isLoadingApps ? (
                <div className="text-sm text-muted-foreground">加载中...</div>
            ) : (
                <RadioGroup value={selectedAppId} onValueChange={onAppChange} className="flex flex-wrap gap-4">
                    {applications?.map(app => (
                        <div key={app.appId} className="flex items-center space-x-2">
                            <RadioGroupItem value={app.appId} id={app.appId} />
                            <Label
                                htmlFor={app.appId}
                                className="flex items-center gap-2 cursor-pointer font-normal text-sm hover:text-primary transition-colors"
                            >
                                <img className="w-5 h-5 object-cover rounded-sm" src={appLogoMap[app.type]} alt={app.name} />
                                <span>{app.name}</span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )}
        </div>
    )
}

/**
 * Hook: 使用应用选择器
 * 返回选中的应用ID和应用列表
 */
export function useAppSelector(autoSelectFirst = true) {
    const [selectedAppId, setSelectedAppId] = useState<string>('')

    // 获取应用列表
    const {
        data: applications,
        isLoading: isLoadingApps,
    } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await srv.fetchApplicationList()
            return res.data.applications
        },
    })

    // 当应用列表加载完成且没有选中应用时，自动选中第一个应用
    useEffect(() => {
        if (autoSelectFirst && applications && applications.length > 0 && !selectedAppId) {
            setSelectedAppId(applications[0]!.appId)
        }
    }, [applications, selectedAppId, autoSelectFirst])

    return {
        selectedAppId,
        setSelectedAppId,
        applications,
        isLoadingApps,
    }
}

