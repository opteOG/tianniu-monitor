import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' })
  }

  /**
   * 校验用户名密码（用于登录）
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      throw new HttpException({ message: '用户名或密码错误', error: 'INVALID_CREDENTIALS' }, HttpStatus.BAD_REQUEST)
    }
    return user
  }
}
