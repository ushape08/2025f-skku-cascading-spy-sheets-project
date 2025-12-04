import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetTrackingLogsParamsDto } from './dto/get-tracking-logs-params.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tracking-logs')
  async GetTrackingLogsParamsDto(@Query() params: GetTrackingLogsParamsDto) {
    return this.adminService.getTrackingLogs(params);
  }
}
