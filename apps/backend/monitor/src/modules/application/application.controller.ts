
import { Body, Controller, Delete, Get, Post, Request, UseGuards, UsePipes } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { nanoid } from 'nanoid'

import { AdminEntity } from '../../entities/admin.entity'
import { ApplicationEntity } from '../../entities/application.entity'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'
import { CreateApplicationDto, createApplicationSchema, DeleteApplicationDto, deleteApplicationSchema } from './application.dto'
import { ApplicationService } from './application.service'

@Controller('application')
@UseGuards(AuthGuard('jwt'))
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

    @Post()
    @UsePipes(new ZodValidationPipe(createApplicationSchema))
    async create(@Body() body: CreateApplicationDto, @Request() req) {
        const admin = new AdminEntity()
        admin.id = req.user.id
        const application = new ApplicationEntity(body)
        Reflect.set<ApplicationEntity, 'appId'>(application, 'appId', application.type + nanoid(6))

        const newApplication = await this.applicationService.create({ ...application, user: admin })
        
        // 转换为前端需要的格式
        const result = {
            type: newApplication.type,
            appId: newApplication.appId,
            name: newApplication.name,
            bugs: 0,
            transactions: 0,
            data: [],
            createdAt: newApplication.createdAt || new Date(),
        }
        
        return { data: result, success: true }
    }

    @Get()
    async list(@Request() req) {
        const result = await this.applicationService.list({ userId: req.user.id })
        return { data: { applications: result.applications }, success: true }
    }

    @Delete()
    @UsePipes(new ZodValidationPipe(deleteApplicationSchema))
    async delete(@Body() body: DeleteApplicationDto, @Request() req) {
        const result = await this.applicationService.delete({ appId: body.appId, userId: req.user.id })
        return { data: result, success: true }
    }
}
