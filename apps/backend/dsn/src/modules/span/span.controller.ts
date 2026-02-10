import { Body, Controller, Get, Logger, Post, Param, UsePipes, Query } from '@nestjs/common'
import { SpanService } from './span.service';
import type { GetOverviewDto } from './span.dto';

@Controller()
export class SpanController {
  constructor(private readonly spanService: SpanService) {}

  // 跟踪span
  @Post('tracing/:app_id')
  tracking(@Param() { app_id }: { app_id: string }, @Body() params: { event_type: string; message: string }) {
    Logger.log(`tracking: ${app_id}, ${params.event_type}, ${params.message}`)
    return this.spanService.tracking(app_id, params)
  }

  @Get('overview')
  async getOverview(@Query() query: GetOverviewDto) {
    const result = await this.spanService.getOverview({
      appId: query.appId,
      granularity: query.granularity,
    })
    return { data: result, success: true }
  }
}
