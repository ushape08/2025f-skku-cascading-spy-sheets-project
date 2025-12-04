import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackingModule } from './tracking/tracking.module';
import { PageModule } from './page/page.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TrackingModule,
    PageModule,
    MongooseModule.forRoot(process.env.MONGODB_URL ?? ''),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
