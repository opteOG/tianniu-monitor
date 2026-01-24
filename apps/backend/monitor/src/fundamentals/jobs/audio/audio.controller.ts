/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { InjectQueue } from '@nestjs/bull'
import { Controller, Post } from '@nestjs/common'
import { Queue } from 'bull'

@Controller('audio')
export class AudioController {
    constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}

    @Post('transcode')
    async transcode() {
        await this.audioQueue.add(
            'transcode',
            {
                file: 'audio.mp3',
            },
            { delay: 1000 }
        )
    }
}
