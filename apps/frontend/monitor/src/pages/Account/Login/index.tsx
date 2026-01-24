import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import * as srv from '@/services'
import { CreateUserPayload } from '@/types/api'

import { YinYangFish } from './YinYangFish'

export function Login() {
  const form = useForm<CreateUserPayload>()
  const [inputType, setInputType] = useState<'login' | 'register'>('login')
  const navigate = useNavigate()
  const { toast } = useToast()

  /**
   * 提交登录或注册表单
   */
  const handleSubmit = async (values: CreateUserPayload) => {
    try {
      const res = await srv[inputType]({
        ...values,
      })

      if (!res.data) {
        toast({
          variant: 'destructive',
          title: '请稍后重试',
        })
        return
      }

      if (inputType === 'login') {
        toast({
          variant: 'success',
          title: '登录成功',
        })

        localStorage.setItem('token', res.data.access_token)

        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/projects'
        navigate(redirectUrl)
      }

      if (inputType === 'register') {
        toast({
          title: '注册成功，请前往登录',
        })
        setInputType('login')
      }
    } catch (err) {
      // @ts-expect-error res is not defined
      const msg = err?.response?.data?.message
      if (inputType === 'register') {
        toast({
          variant: 'destructive',
          title: `注册失败，${msg}`,
        })
        return
      }
      toast({
        variant: 'destructive',
        title: `登录失败，用户名或密码错误，请重试`,
      })
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* 左侧背景区域 */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <YinYangFish />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">企业性能与异常监控平台</h2>
            <p className="text-blue-100 text-sm">Enterprise Performance & Exception Monitoring</p>
          </div>

          <div className="relative z-10">
            <blockquote className="space-y-4">
              <p className="text-3xl font-light text-white mb-6">&ldquo;监控无小事，稳定即价值&rdquo;</p>
              <p className="text-sm text-blue-100 leading-relaxed max-w-md">
                企业级性能与异常监控平台，实时追踪应用性能指标， 智能分析异常模式，助力企业构建稳定可靠的数字化基础设施。
              </p>
            </blockquote>
          </div>
        </div>

        {/* 右侧登录表单区域 */}
        <div className="flex items-center justify-center p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">欢迎登录</h1>
              <p className="text-gray-600">Enterprise Performance Monitoring Platform</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  rules={{ required: '请输入用户名' }}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">用户名</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="请输入用户名"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: '请输入密码' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">密码</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="请输入密码"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                  {inputType == 'login' ? '登录' : '注册'}
                </Button>
              </form>
            </Form>
            {inputType === 'login' ? (
              <div className="text-center text-sm text-gray-600">
                没有账号?{' '}
                <Button
                  variant="link"
                  onClick={() => {
                    form.clearErrors()
                    setInputType('register')
                  }}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                >
                  立即注册
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-600">
                已有账号?{' '}
                <Button
                  variant="link"
                  onClick={() => {
                    form.clearErrors()
                    setInputType('login')
                  }}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                >
                  立即登录
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
