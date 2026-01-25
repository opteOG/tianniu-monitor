import { User } from 'lucide-react'

import { AppSelector, useAppSelector } from '@/components/AppSelector'

export function UserBehavior() {
    const { selectedAppId, setSelectedAppId } = useAppSelector()

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between h-[36px] mb-6">
                <h1 className="flex flex-row items-center text-xl font-semibold">
                    <User className="h-6 w-6 mr-2" />
                    监控-用户行为
                </h1>
            </header>

            {/* 应用选择器 */}
            <AppSelector selectedAppId={selectedAppId} onAppChange={setSelectedAppId} />

            {/* 内容区域 */}
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">监控-用户行为</h2>
                    <p className="mt-2 text-muted-foreground">功能开发中...</p>
                    {selectedAppId && <p className="mt-1 text-sm text-muted-foreground">当前应用ID: {selectedAppId}</p>}
                </div>
            </div>
        </div>
    )
}

