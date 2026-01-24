import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from './constants'
import { AdminService } from '../admin/admin.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }
  /**
   * 校验 token payload，并将返回值挂载到 req.user
   */
  async validate(payload: any) {
    const user = await this.adminService.findById(payload?.sub)
    if (!user) {
      throw new UnauthorizedException('无效的登录状态')
    }
    const { password, ...result } = user
    return result
  }
}
