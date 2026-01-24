/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Injectable, Logger } from '@nestjs/common'
import { Cron, Interval, Timeout } from '@nestjs/schedule'

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name)

    @Cron('45 * * * * *')
    handleCron() {
        this.logger.debug('Called when the second is 45')
    }

    @Interval(10000)
    handleInterval() {
        this.logger.debug('Called every 10 seconds')
    }

    @Timeout(5000)
    handleTimeout() {
        this.logger.debug('Called once after 5 seconds')
    }
}
