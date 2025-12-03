import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

@Module({
  exports: [TrackingService],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
