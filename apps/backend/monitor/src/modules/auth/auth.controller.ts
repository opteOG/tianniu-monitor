import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from '../../guard/auth.guard'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录，成功后返回 access_token
   */
  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    const data = await this.authService.login(req.user)
    return { data, success: true }
  }

  /**
   * 获取当前登录用户信息
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('currentUser')
  async currentUser(@Request() req) {
    return { data: req.user, success: true }
  }

  /**
   * 用户退出登录（前端清理 token 即可）
   */
  @Post('auth/logout')
  async logout() {
    return { data: null, success: true }
  }
}
