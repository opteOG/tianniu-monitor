import { Module } from '@nestjs/common'

// import { EmailAlertsModule } from '../../fundamentals/jobs/email-alerts/email-alerts.module'
import { EmailModule } from '../email/email.module'
import { EmailService } from '../email/email.service'
import { SpanController } from './span.controller'
import { SpanService } from './span.service'

@Module({
    imports: [EmailModule],
    controllers: [SpanController],
    providers: [SpanService, EmailService],
})
export class SpanModule {}