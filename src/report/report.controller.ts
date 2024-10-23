import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Request } from 'express';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  getReport(
    @Req() req: Request,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportService.getReport(req.user['sub'], startDate, endDate);
  }
}
