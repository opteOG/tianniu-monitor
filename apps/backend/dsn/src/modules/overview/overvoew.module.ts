import { Module } from '@nestjs/common'
import { OverviewController } from './overview.controller'
import { OverviewService } from './overview.service'
import { SpanModule } from '../span/span.module'

@Module({
  imports: [SpanModule],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export default class OverviewModule {}
