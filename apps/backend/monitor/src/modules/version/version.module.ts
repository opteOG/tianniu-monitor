/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Module } from '@nestjs/common'

import { EmailModule } from '../email/email.module'
import { EmailService } from '../email/email.service'
import { VersionController } from './version.controller'
import { VersionService } from './version.service'

@Module({
    imports: [EmailModule],
    controllers: [VersionController],
    providers: [VersionService, EmailService],
})
export class VersionModule {}
