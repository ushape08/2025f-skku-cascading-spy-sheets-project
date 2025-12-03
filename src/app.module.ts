import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './image/image.module';
import { PageModule } from './page/page.module';

@Module({
  imports: [ImageModule, PageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
