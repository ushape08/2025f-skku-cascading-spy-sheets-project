import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetTrackingLogsParamsDto } from './dto/get-tracking-logs-params.dto';
import { KeyGuard } from '../auth/key-guard.auth';
import { GetTrackingLogByIdResponseDto } from './dto/get-tracking-log-by-id-response.dto';
import { CompareTrackingLogsResponseDto } from './dto/compare-tracking-logs-response.dto';

@Controller('admin')
@UseGuards(KeyGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tracking-logs')
  async getTrackingLogsParamsDto(@Query() params: GetTrackingLogsParamsDto) {
    return await this.adminService.getTrackingLogs(params);
  }

  @Get('tracking-by-id')
  async getTrackingLogById(
    @Query('id') id: string,
  ): Promise<GetTrackingLogByIdResponseDto> {
    return await this.adminService.getTrakcingLogById(id);
  }

  @Get('compare-ids')
  async compareTrackingLogs(
    @Query('id1') id1: string,
    @Query('id2') id2: string,
  ): Promise<CompareTrackingLogsResponseDto> {
    return await this.adminService.compareTrackingLogs(id1, id2);
  }
}
