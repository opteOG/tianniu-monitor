import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Layout } from '@/layout'
import { Errors } from '@/views/Errors'
import { Login } from '@/views/Login'
import { PerformanceMetrics } from '@/views/PerformanceMetrics'
import { Projects } from '@/views/Projects'
import { UserBehavior } from '@/views/UserBehavior'

import AuthRoute from './AuthRoute'

// 这里是为了解决 react-router-dom 的类型问题
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PickRouter<T> = T extends (...args: any[]) => infer R ? R : never

type A = typeof createBrowserRouter

export const router: PickRouter<A> = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthRoute>
                <Layout />
            </AuthRoute>
        ),
        children: [
            {
                path: 'projects',
                element: <Projects />,
            },
            {
                path: 'errors',
                element: <Errors />,
            },
            {
                path: 'performance-metrics',
                element: <PerformanceMetrics />,
            },
            {
                path: 'user-behavior',
                element: <UserBehavior />,
            },
            {
                path: '/',
                element: <Navigate to="/projects" replace />,
            },
        ],
    },
    {
        path: '/account/login',
        element: <Login />,
    },
])
