import { Body, Controller, Get, Logger, Post, Param, UsePipes, Query } from '@nestjs/common'
import { SpanService } from './span.service'

@Controller()
export class SpanController {
  constructor(private readonly spanService: SpanService) {}

  // 跟踪span
  @Post('tracing/:app_id')
  tracking(@Param() { app_id }: { app_id: string }, @Body() params: { event_type: string; message: string }) {
    Logger.log(`tracking: ${app_id}, ${params.event_type}, ${params.message}`)
    return this.spanService.tracking(app_id, params)
  }

}
