import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ApplicationEntity } from '../../entities/application.entity'
import { TimeGranularity } from './application.dto'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>
  ) {}
  // 创建应用
  async create(payload) {
    const saved = await this.applicationRepository.save(payload)
    return saved
  }
  // 获取用户应用列表
  async list(params: { userId: number }) {
    const [data, count] = await this.applicationRepository.findAndCount({
      where: { user: { id: params.userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })

    // 转换为前端需要的格式
    const applications = data.map(app => ({
      type: app.type,
      appId: app.appId,
      name: app.name,
      bugs: 0, // TODO: 从错误统计中获取
      transactions: 0, // TODO: 从性能统计中获取
      data: [], // TODO: 从统计数据中获取
      createdAt: app.createdAt || new Date(),
    }))

    return {
      applications,
      count,
    }
  }
  // 删除应用
  async delete(payload: { appId: string; userId: number }) {
    const result = await this.applicationRepository.findOne({
      where: { appId: payload.appId, user: { id: payload.userId } },
    })

    if (!result) {
      throw new NotFoundException('Application not found')
    }

    await this.applicationRepository.remove(result)
    return { success: true }
  }
  // 获取应用总览
  async getOverview(payload: { appId: string; granularity: TimeGranularity }) {
    return payload
  }
}
