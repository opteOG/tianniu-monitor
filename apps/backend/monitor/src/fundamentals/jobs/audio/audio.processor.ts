/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { OnQueueActive, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

@Processor('audio')
export class AudioProcessor {
    private readonly logger = new Logger(AudioProcessor.name)

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`)
    }

    @Process('transcode')
    handleTranscode(job: Job) {
        this.logger.debug('Start transcoding...')
        this.logger.debug(job.data)
        this.logger.debug('Transcoding completed')
    }
}
