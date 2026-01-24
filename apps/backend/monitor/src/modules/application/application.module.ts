/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ApplicationEntity } from '../../entities/application.entity'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'

@Module({
    imports: [TypeOrmModule.forFeature([ApplicationEntity])],
    controllers: [ApplicationController],
    providers: [ApplicationService],
    exports: [],
})
export class ApplicationModule {}
