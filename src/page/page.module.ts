import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [TrackingModule],
  exports: [],
  controllers: [PageController],
  providers: [],
})
export class PageModule {}
