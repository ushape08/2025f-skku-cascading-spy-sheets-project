import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackingModule } from './tracking/tracking.module';
import { PageModule } from './page/page.module';

@Module({
  imports: [TrackingModule, PageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
