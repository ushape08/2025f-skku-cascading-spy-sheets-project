import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { MongoModule } from 'src/mongo/mongo.module';

@Module({
  imports: [MongoModule],
  exports: [TrackingService],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
