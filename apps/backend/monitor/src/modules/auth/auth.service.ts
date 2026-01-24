import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AdminService } from '../admin/admin.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService
  ) {}

  /**
   * 校验用户名密码，返回不包含密码字段的用户信息
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.adminService.validateUser(username, password)
    if (user) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  /**
   * 为已通过认证的用户签发 JWT
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
