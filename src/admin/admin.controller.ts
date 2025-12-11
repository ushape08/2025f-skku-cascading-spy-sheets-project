import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetTrackingLogsParamsDto } from './dto/get-tracking-logs-params.dto';
import { KeyGuard } from '../auth/key-guard.auth';

@Controller('admin')
@UseGuards(KeyGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tracking-logs')
  async GetTrackingLogsParamsDto(@Query() params: GetTrackingLogsParamsDto) {
    return await this.adminService.getTrackingLogs(params);
  }

  @Get('tracking-by-id')
  async GetTrackingLogById(@Query('id') id: string) {
    return await this.adminService.getTrakcingLogById(id);
  }

  @Get('compare-ids')
  async compareTrackingLogs(
    @Query('id1') id1: string,
    @Query('id2') id2: string,
  ) {
    return await this.adminService.compareTrackingLogs(id1, id2);
  }
}
