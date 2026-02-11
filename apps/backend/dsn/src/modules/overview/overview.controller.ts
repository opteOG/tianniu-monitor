import { Controller, Get, Query, UsePipes } from '@nestjs/common'
import { OverviewService } from './overview.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { type GetOverviewDto, getOverviewSchema } from './overview.dto'

@Controller('overview')
export class OverviewController {
  constructor(private overviewService: OverviewService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(getOverviewSchema))
  async getOverview(@Query() query: GetOverviewDto) {
    const result = await this.overviewService.getOverview(query)
    return { data: result, success: true }
  }
}
