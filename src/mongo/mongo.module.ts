import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracking, TrackingSchema } from './schemas/tracking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tracking.name,
        schema: TrackingSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
