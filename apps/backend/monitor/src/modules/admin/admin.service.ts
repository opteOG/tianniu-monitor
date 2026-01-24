import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { AdminEntity } from '../../entities/admin.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AdminService {
  constructor(@InjectRepository(AdminEntity) private readonly adminRepository: Repository<AdminEntity>) {}

  /**
   * 根据用户名与密码验证用户
   */
  async validateUser(username: string, password: string) {
    const admin = await this.adminRepository.findOne({ where: { username } })
    if (!admin) {
      return null
    }

    const storedPassword = admin.password ?? ''
    if (!storedPassword) {
      return null
    }

    const isBcryptHash = storedPassword.startsWith('$2')
    const isMatch = isBcryptHash ? await bcrypt.compare(password, storedPassword) : storedPassword === password
    if (!isMatch) {
      return null
    }

    if (!isBcryptHash) {
      admin.password = await bcrypt.hash(password, 10)
      await this.adminRepository.save(admin)
    }

    return admin
  }

  /**
   * 根据用户 id 获取用户信息
   */
  async findById(id: number) {
    if (!id) {
      return null
    }
    const admin = await this.adminRepository.findOne({ where: { id } })
    return admin
  }

  /**
   * 注册新用户（服务端对密码进行 bcrypt 哈希，返回时剔除密码）
   */
  async register(body) {
    const adminIsExist = await this.adminRepository.findOne({ where: { username: body.username } })
    if (adminIsExist) {
      throw new HttpException({ message: '用户已存在', error: 'USER_EXIST' }, 400)
    }

    if (!body?.password) {
      throw new HttpException({ message: '密码不能为空', error: 'PASSWORD_REQUIRED' }, 400)
    }

    const admin = this.adminRepository.create({
      ...body,
      password: await bcrypt.hash(body.password, 10),
      email: body.email ?? '',
      phone: body.phone ?? '',
      role: body.role ?? 'admin',
    })
    const savedAdmin = await this.adminRepository.save(admin)
    const { password, ...result } = savedAdmin[0]
    return result
  }
}
