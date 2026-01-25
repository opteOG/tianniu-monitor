
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
