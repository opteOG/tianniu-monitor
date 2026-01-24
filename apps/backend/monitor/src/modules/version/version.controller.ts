/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Controller, Get, Query } from '@nestjs/common'

import { VersionService } from './version.service'

@Controller()
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Get('version')
    getProfile() {
        return this.versionService.getVersion()
    }

    @Get('tracking')
    tracking(@Query() params: { event_type: string; message: string }) {
        return this.versionService.tracking(params)
    }

    @Get('span')
    span() {
        return this.versionService.span()
    }

    @Get('email')
    email(@Query() params: { to: string; subject: string; text: string }) {
        return this.versionService.sendEmail(params)
    }

    @Get('alert')
    alert(@Query() params: { to: string; subject: string; text: string }) {
        return this.versionService.alert(params)
    }
}
