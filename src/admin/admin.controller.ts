import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetTrackingLogsParamsDto } from './dto/get-tracking-logs-params.dto';
import { KeyGuard } from 'src/auth/key-guard.auth';

@Controller('admin')
@UseGuards(KeyGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tracking-logs')
  async GetTrackingLogsParamsDto(@Query() params: GetTrackingLogsParamsDto) {
    return this.adminService.getTrackingLogs(params);
  }
}
