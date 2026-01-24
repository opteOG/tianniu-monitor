/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AudioController } from './audio.controller'
import { AudioProcessor } from './audio.processor'

@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: 'audio',
            useFactory: (config: ConfigService) => ({
                redis: config.get('redis'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AudioController],
    providers: [AudioProcessor],
})
export class AudioModule {}
