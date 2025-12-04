import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MongoModule } from '../mongo/mongo.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [MongoModule],
  controllers: [AdminController],
  exports: [AdminService],
  providers: [AdminService],
})
export class AdminModule {}
