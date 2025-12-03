import { Module } from '@nestjs/common';
import { PageController } from './page.controller';

@Module({
  exports: [],
  controllers: [PageController],
  providers: [],
})
export class PageModule {}
