import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get('summary')
  async getSummary(@Query() q: DashboardQueryDto) {
    return this.svc.getSummary(q.days ?? 30);
  }
}